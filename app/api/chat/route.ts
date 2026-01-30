export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    console.log("Received messages:", messages)

    const lastMessage = messages[messages.length - 1]?.content || ""
    console.log("Last message:", lastMessage)

    // Mock responses based on common resume questions
    let response = ""

    if (lastMessage.toLowerCase().includes("ats") || lastMessage.toLowerCase().includes("ats-friendly")) {
      response = `Making Your Resume ATS-Friendly:

• Use standard section headings (Experience, Education, Skills)
• Include relevant keywords from the job description
• Use simple, clean formatting without tables or graphics
• Save as both .docx and .pdf formats
• Use standard fonts like Arial, Calibri, or Times New Roman
• Avoid headers/footers as ATS may not read them

ATS Score: 8/10 - Following these guidelines will significantly improve your resume's ATS compatibility.`
    } else if (lastMessage.toLowerCase().includes("mistakes") || lastMessage.toLowerCase().includes("avoid")) {
      response = `Common Resume Mistakes to Avoid:

Content Mistakes:
• Using generic objectives instead of targeted summaries
• Listing job duties instead of achievements
• Including irrelevant work experience
• Not quantifying accomplishments with numbers

Formatting Mistakes:
• Using unprofessional email addresses
• Including photos (unless required)
• Making it too long (keep to 1-2 pages)
• Using inconsistent formatting

Grammar & Language:
• Spelling and grammar errors
• Using passive voice instead of active
• Not using action verbs to start bullet points
• Including personal information (age, marital status)

Overall Quality Score: 7/10 - Avoiding these mistakes will make your resume much more professional.`
    } else if (lastMessage.toLowerCase().includes("format") || lastMessage.toLowerCase().includes("experience")) {
      response = `How to Format Work Experience:

Structure for Each Role:
• Job Title | Company Name | Location | Dates
• 3-5 bullet points highlighting achievements
• Start each bullet with strong action verbs
• Include quantifiable results when possible

Example:
Software Developer | Tech Corp | San Francisco, CA | Jan 2020 - Present
• Developed 15+ web applications using React and Node.js, improving user engagement by 40%
• Led a team of 4 developers in agile development processes
• Reduced application load time by 60% through code optimization
• Collaborated with UX team to implement responsive design features

Formatting Score: 9/10 - This structure is clean, professional, and ATS-friendly.`
    } else if (lastMessage.toLowerCase().includes("keywords") || lastMessage.toLowerCase().includes("tech")) {
      response = `Keywords for Tech Roles:

Programming Languages:
• JavaScript, Python, Java, C++, TypeScript
• React, Angular, Vue.js, Node.js
• HTML5, CSS3, SASS/SCSS

Frameworks & Tools:
• Git, Docker, Kubernetes, AWS, Azure
• MongoDB, PostgreSQL, MySQL
• Agile, Scrum, DevOps, CI/CD

Soft Skills:
• Problem-solving, Team collaboration
• Project management, Communication
• Leadership, Analytical thinking

Industry-Specific:
• Machine Learning, Data Analysis
• Cloud Computing, Microservices
• API Development, Database Design

Keyword Optimization Score: 8/10 - Include 6-8 relevant keywords naturally throughout your resume.`
    } else if (lastMessage.toLowerCase().includes("length") || lastMessage.toLowerCase().includes("long")) {
      response = `Resume Length Guidelines:

General Rules:
• Entry-level (0-5 years): 1 page maximum
• Mid-level (5-10 years): 1-2 pages
• Senior-level (10+ years): 2 pages maximum
• Executive/Academic: 2-3 pages acceptable

What to Include:
• Most recent 10-15 years of experience
• Relevant education and certifications
• Key skills and achievements
• Professional summary (3-4 lines)

What to Remove:
• Outdated or irrelevant experience
• High school education (if you have college degree)
• References line (provide separately when requested)
• Personal hobbies (unless directly relevant)

Length Optimization Score: 9/10 - Concise resumes get more attention from recruiters.`
    } else if (lastMessage.toLowerCase().includes("analyze") && lastMessage.toLowerCase().includes("resume")) {
      response = `Resume Analysis Complete:

Overall Score: 7.5/10

Strengths:
✅ Clear contact information
✅ Professional summary present
✅ Consistent formatting
✅ Relevant work experience

Areas for Improvement:
• Quantify achievements - Add specific numbers and percentages
• Stronger action verbs - Replace weak verbs with impactful ones
• Skills section - Organize by relevance to target role
• ATS optimization - Include more industry keywords

Specific Recommendations:
1. Add metrics to your accomplishments (increased sales by X%, managed team of X people)
2. Tailor your professional summary to the specific role you're targeting
3. Include 2-3 key achievements in each role
4. Ensure consistent date formatting throughout

Next Steps:
• Revise based on these suggestions
• Have someone proofread for grammar
• Customize for each job application

Would you like me to elaborate on any of these points?`
    } else {
      response = `Hello! I'm Nitesh's Resume Validation Assistant.

I can help you improve your resume with:

📋 Resume Analysis
• Content review and feedback
• ATS compatibility check
• Formatting suggestions
• Industry-specific advice

💡 I can answer questions about:
• What makes a resume ATS-friendly?
• How should I format my work experience?
• What keywords should I include?
• What are common mistakes to avoid?
• How long should my resume be?

To get started:
1. Paste your resume content for detailed analysis
2. Ask specific questions about resume best practices
3. Click on the quick prompt buttons above

What would you like help with today?`
    }

    // Return a simple JSON response that useChat can handle
    return new Response(
      JSON.stringify({
        id: Date.now().toString(),
        role: "assistant",
        content: response,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("API Error:", error)
    return new Response(
      JSON.stringify({
        error: "Sorry, I'm having trouble processing your request. Please try again.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
