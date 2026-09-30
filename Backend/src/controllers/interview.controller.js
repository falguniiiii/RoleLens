const mongoose = require('mongoose');
const { PDFParse } = require('pdf-parse');
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');

const MAX_JOB_DESCRIPTION = 12000;
const MAX_SELF_DESCRIPTION = 5000;
const MAX_RESUME_TEXT = 30000;

const asText = (value) => (typeof value === 'string' ? value.trim() : '');
const clampScore = (value) => Math.min(100, Math.max(0, Math.round(Number(value) || 0)));

async function extractPdfText(buffer) {
    if (buffer.subarray(0, 5).toString() !== '%PDF-') return null;

    const parser = new PDFParse({ data: buffer });
    try {
        const { text } = await parser.getText();
        return asText(text).slice(0, MAX_RESUME_TEXT);
    } catch {
        return null;
    } finally {
        await parser.destroy().catch(() => {});
    }
}

/** @route POST /api/interview  @access Private */
async function generateInterviewReportController(req, res) {
    const jobDescription = asText(req.body.jobDescription);
    const selfDescription = asText(req.body.selfDescription);

    if (!jobDescription || jobDescription.length > MAX_JOB_DESCRIPTION) {
        return res.status(400).json({
            message: `Job description is required and must be ${MAX_JOB_DESCRIPTION} characters or fewer`
        });
    }

    if (selfDescription.length > MAX_SELF_DESCRIPTION) {
        return res.status(400).json({
            message: `Self description must be ${MAX_SELF_DESCRIPTION} characters or fewer`
        });
    }

    let resumeContent = '';

    if (req.file) {
        const text = await extractPdfText(req.file.buffer);

        if (text === null) {
            return res.status(400).json({
                message: 'Could not read that PDF. Please upload a valid text-based PDF.'
            });
        }

        resumeContent = text;
    }

    if (!resumeContent && selfDescription.length < 20) {
        return res.status(400).json({
            message: 'Upload a resume or write a self description (at least 20 characters)'
        });
    }

    const ai = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    });

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        title: String(ai.title || 'Untitled Position').slice(0, 200),
        matchScore: clampScore(ai.matchScore),
        technicalQuestions: ai.technicalQuestions,
        behavioralQuestions: ai.behavioralQuestions,
        skillGaps: ai.skillGaps,
        preparationPlan: ai.preparationPlan
    });

    return res.status(201).json({
        message: 'Interview report generated successfully',
        interviewReport
    });
}

const validId = (id) => mongoose.isValidObjectId(id);

/** @route GET /api/interview/report/:interviewId  @access Private */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    if (!validId(interviewId)) {
        return res.status(404).json({ message: 'Interview report not found.' });
    }

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    });

    if (!interviewReport) {
        return res.status(404).json({ message: 'Interview report not found.' });
    }

    res.status(200).json({
        message: 'Interview report fetched successfully.',
        interviewReport
    });
}

/** @route GET /api/interview  @access Private */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select('-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan');

    res.status(200).json({
        message: 'Interview reports fetched successfully.',
        interviewReports
    });
}

/** @route DELETE /api/interview/report/:interviewId  @access Private (owner only) */
async function deleteInterviewReportController(req, res) {
    const { interviewId } = req.params;

    if (!validId(interviewId)) {
        return res.status(404).json({ message: 'Interview report not found.' });
    }

    const deleted = await interviewReportModel.findOneAndDelete({
        _id: interviewId,
        user: req.user.id
    });

    if (!deleted) {
        return res.status(404).json({ message: 'Interview report not found.' });
    }

    res.status(200).json({ message: 'Interview report deleted.' });
}

/** @route POST /api/interview/resume/pdf/:interviewReportId  @access Private (owner only) */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;

    if (!validId(interviewReportId)) {
        return res.status(404).json({ message: 'Interview report not found.' });
    }

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    });

    if (!interviewReport) {
        return res.status(404).json({ message: 'Interview report not found.' });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({
        resume,
        jobDescription,
        selfDescription
    });

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume_${interviewReportId}.pdf"`
    });

    res.send(pdfBuffer);
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    deleteInterviewReportController,
    generateResumePdfController
};
