import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
    deleteInterviewReport,
    extendInterviewRoadmap
} from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context

    const [roadmapLoading, setRoadmapLoading] = useState(false)
    const [roadmapError, setRoadmapError] = useState('')

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setReport(null)
        setError('')

        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const removeReport = async (id) => {
        await deleteInterviewReport(id)
        setReports((prev) => prev.filter((r) => r._id !== id))
        if (interviewId === id) setReport(null)
    }

    const getReportById = async (id) => {
        setLoading(true)
        setReport(null)
        setError('')

        try {
            const response = await getInterviewReportById(id)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const extendRoadmap = async (totalDays) => {
    setRoadmapLoading(true)
    setRoadmapError('')

    try {
        const response = await extendInterviewRoadmap({
            interviewId,
            totalDays
        })

        setReport(response.interviewReport)

        return response.interviewReport
    } catch (err) {
        setRoadmapError(err.message)
        throw err
    } finally {
        setRoadmapLoading(false)
    }
}

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)

        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId).catch(() => {})
        } else {
            getReports().catch(() => {})
        }
    }, [interviewId])

    return { 
    loading, 
    report, 
    reports, 
    error, 
    roadmapLoading,
    roadmapError,
    generateReport, 
    getReportById, 
    getReports, 
    getResumePdf, 
    removeReport,
    extendRoadmap
}
}
