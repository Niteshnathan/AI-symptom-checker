"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Send, Upload, CheckCircle, AlertCircle, Lightbulb } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ResumeValidatorChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resumeText, setResumeText] = useState("")
  const [showResumeInput, setShowResumeInput] = useState(false)

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || data.error || "Sorry, I couldn't process your request.",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input)
      setInput("")
    }
  }

  const handleResumeSubmit = () => {
    if (resumeText.trim()) {
      const resumeMessage = `Please analyze and validate my resume:\n\n${resumeText}`
      sendMessage(resumeMessage)
      setResumeText("")
      setShowResumeInput(false)
    }
  }

  const quickPrompts = [
    "What makes a resume ATS-friendly?",
    "How should I format my work experience?",
    "What keywords should I include for tech roles?",
    "How long should my resume be?",
    "What are common resume mistakes to avoid?",
  ]

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Resume Validator by Nitesh</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get professional feedback on your resume with AI-powered analysis by Nitesh. Upload your resume content and
            receive detailed suggestions for improvement.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Resume Analysis Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <Button onClick={() => setShowResumeInput(!showResumeInput)} className="mb-4" size="lg">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resume for Analysis
                  </Button>
                </div>

                {showResumeInput && (
                  <div className="space-y-4 mb-6">
                    <Textarea
                      placeholder="Paste your resume content here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleResumeSubmit} disabled={!resumeText.trim()}>
                        Analyze Resume
                      </Button>
                      <Button variant="outline" onClick={() => setShowResumeInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-3">Or ask a quick question:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickPrompts.map((prompt, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => handleQuickPrompt(prompt)}
                      >
                        {prompt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {messages.map((message, index) => (
                <div key={message.id}>
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-600">Nitesh AI</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                  {index < messages.length - 1 && <Separator className="my-4" />}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border shadow-sm p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Analyzing your resume...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about resume best practices, or paste your resume content..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              What I Can Help With
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Content Analysis</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Professional summary optimization</li>
                  <li>• Work experience impact statements</li>
                  <li>• Skills section relevance</li>
                  <li>• Achievement quantification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technical Review</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• ATS compatibility check</li>
                  <li>• Formatting and structure</li>
                  <li>• Keyword optimization</li>
                  <li>• Grammar and language quality</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
