import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
})

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message ||
    error.response?.data?.error ||
    fallback

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)

    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    try {
        const response = await api.post("/api/interview/", formData)
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, "Could not generate your interview report. Please try again."))
    }
}

export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`)
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, "Could not load this interview report."))
    }
}

export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview/")
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, "Could not load your interview plans."))
    }
}

export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
            responseType: "blob"
        })
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, "Could not generate the resume PDF. Please try again."))
    }
}

export const deleteInterviewReport = async (interviewId) => {
    try {
        const response = await api.delete(`/api/interview/report/${interviewId}`)
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, "Could not delete that interview plan."))
    }
}

export const extendInterviewRoadmap = async ({ interviewId, totalDays }) => {
    try {
        const response = await api.post(
            `/api/interview/report/${interviewId}/roadmap`,
            { totalDays }
        )

        return response.data
    } catch (error) {
        throw new Error(
            getErrorMessage(
                error,
                "Could not extend your preparation roadmap. Please try again."
            )
        )
    }
}