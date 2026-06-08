import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"


export const useInterview = () => {

    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError(null)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            const r = response?.interviewReport || response
            if (r) {
                setReport(r)
                return r
            }
            setError({ status: 500, message: 'Invalid response from server' })
        } catch (err) {
            console.error(err)
            setError({ status: err?.response?.status || 500, message: err?.response?.data?.message || err.message })
        } finally {
            setLoading(false)
        }
        return null
    }

    const getReportById = async (id) => {
        if (!id) return null
        setLoading(true)
        setError(null)
        try {
            const response = await getInterviewReportById(id)
            const reportData = response?.interviewReport || response?.report || response
            if (reportData && typeof reportData === 'object') {
                setReport(reportData)
                return reportData
            }
            setError({ status: 404, message: 'Interview report not found.' })
        } catch (err) {
            console.error(err)
            setError({ status: err?.response?.status || 500, message: err?.response?.data?.message || err.message })
        } finally {
            setLoading(false)
        }
        return null
    }

    const getReports = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getAllInterviewReports()
            const listData = response?.interviewReports || response?.reports || (Array.isArray(response) ? response : [])
            setReports(listData)
            return listData
        } catch (err) {
            console.error(err)
            setError({ status: err?.response?.status || 500, message: err?.response?.data?.message || err.message })
        } finally {
            setLoading(false)
        }
        return null
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error(err)
            setError({ status: err?.response?.status || 500, message: err?.response?.data?.message || err.message })
        } finally {
            setLoading(false)
        }
    }

    return { loading, report, reports, error, generateReport, getReportById, getReports, getResumePdf }
}