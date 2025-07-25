import { catchAsync } from '../utils/catchAsync.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Analyze blog content for modification using Gemini API
export const analyzeBlogModification = catchAsync(async (req, res) => {
    const { existingContent, modificationRequest } = req.body;

    if (!existingContent || !modificationRequest) {
        return res.status(400).json({
            success: false,
            message: 'Existing content and modification request are required'
        });
    }

    try {
        // Check if GEMINI_API_KEY is available
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        console.log('Calling Gemini API for content analysis and modification...');
        
        // Step 1: Analyze the content and extract the specific part that needs modification
        const analysisResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Analyze this blog content and identify the specific part that needs modification based on the user's request.

Blog Content:
${existingContent}

User's Modification Request:
${modificationRequest}

Instructions:
You are an expert blog content analyzer. Your task is to identify and extract the specific part of the blog that needs modification based on the user's request.

CONTENT IDENTIFICATION RULES:
- If request mentions "title", "heading", "header", "h1", "change heading", "modify title": extract ONLY the main <h1> heading tag with its content
- If request mentions "introduction", "intro", "opening": extract the first paragraph after the main heading
- If request mentions "subheading", "subtitle", "h2", "h3": extract the relevant subheading and its content
- If request mentions "conclusion", "ending", "summary", "final thoughts": extract the conclusion section (usually marked with <h2>Conclusion</h2> or similar)
- If request mentions "body", "content", "main content": extract all paragraphs between introduction and conclusion
- If request mentions "paragraph" with numbers ("first paragraph", "second paragraph"): extract that specific paragraph
- If request mentions "image", "picture", "visual": extract image-related content or placeholder locations
- If request is general ("make it longer", "make it shorter", "improve", "enhance"): extract the entire content
- If request mentions specific topics or keywords: extract paragraphs containing those topics

IMPORTANT FOR HEADINGS:
- When extracting headings, return ONLY the complete <h1> tag with its content, nothing else
- Example: <h1>Original Heading</h1>
- Do not include surrounding paragraphs or other content when the request is specifically about headings

EXTRACTION GUIDELINES:
- Preserve HTML structure and formatting
- Include surrounding context when necessary for coherent modification
- For headings, include the complete heading tag
- For paragraphs, include complete <p> tags
- For images, include complete <img> tags and any surrounding containers
- Return ONLY the extracted content, no explanations
- CRITICAL: Do NOT wrap the response in markdown code blocks
- Return raw HTML content directly without any markdown formatting
- Do NOT include any backticks in your response

Extract the relevant part:`
                    }]
                }]
            })
        });

        if (!analysisResponse.ok) {
            const errorText = await analysisResponse.text();
            console.error(`Gemini API analysis error: ${analysisResponse.status} - ${errorText}`);
            throw new Error(`Gemini API analysis error: ${analysisResponse.status} - ${errorText}`);
        }

        const analysisData = await analysisResponse.json();
        console.log('Gemini API analysis response received successfully');
        
        // Extract the specific content part from Gemini response
        if (!analysisData.candidates || !analysisData.candidates[0] || !analysisData.candidates[0].content || !analysisData.candidates[0].content.parts || !analysisData.candidates[0].content.parts[0]) {
            console.error('Invalid Gemini API analysis response structure:', analysisData);
            throw new Error('Invalid response structure from Gemini API analysis');
        }
        
        const extractedContent = analysisData.candidates[0].content.parts[0].text.trim();
        console.log('Extracted content length:', extractedContent.length);
        console.log('Extracted content preview:', extractedContent.substring(0, 100));

        // Step 2: Modify the extracted content according to the user's request
        const modificationResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Modify this content according to the user's request:

Original Content to Modify:
${extractedContent}

User's Modification Request:
${modificationRequest}

Instructions:
You are an expert blog content editor and enhancer. Apply the requested modifications while maintaining professional quality and readability.

MODIFICATION GUIDELINES:

FOR HEADINGS/TITLES:
- Make headings compelling, SEO-friendly, and engaging
- Ensure headings are descriptive and capture the main topic
- Use proper heading hierarchy (H1 for main title, H2 for major sections, H3 for subsections)
- Avoid generic titles; make them specific and valuable
- CRITICAL: When modifying a heading, return ONLY the complete <h1> tag with the new content
- Example format: <h1>New Compelling Heading Here</h1> or if subsubheading is asked then return <h3>New Compelling Subsubheading Here</h3>
- Do not add extra paragraphs, explanations, or other content when modifying headings

FOR PARAGRAPHS/CONTENT:
- Maintain logical flow and coherence
- Use clear, concise language appropriate for the target audience
- Include relevant examples, statistics, or case studies when expanding content
- Ensure smooth transitions between ideas
- Break up long paragraphs for better readability

FOR INTRODUCTIONS:
- Hook the reader with an engaging opening
- Clearly state what the article will cover
- Include relevant context or background information
- Keep it concise but informative (100-150 words)

FOR CONCLUSIONS:
- Summarize key points effectively
- Provide actionable takeaways or next steps
- End with a compelling call-to-action when appropriate
- Reinforce the main message (100-150 words)

FOR IMAGES:
- When adding images, use placeholder format: <img src="./assets/placeholder.svg" class="placeholder-image" style="display: block; margin: 2em auto; max-width: 400px; height: 400px;">
- Place images strategically to break up text and enhance understanding
- When removing images, ensure content flow remains natural
- When enhancing image descriptions, make alt text descriptive and SEO-friendly

CONTENT ENHANCEMENT RULES:
- If request is "make it longer": Add relevant details, examples, explanations, or related subtopics
- If request is "make it shorter": Condense while preserving key information and main points
- If request is "more engaging": Add storytelling elements, questions, or interactive language
- If request is "more professional": Use formal tone, industry terminology, and authoritative language
- If request is "add examples": Include relevant, practical examples that illustrate the points
- If request is "improve SEO": Naturally incorporate relevant keywords and improve readability

FORMATTING REQUIREMENTS:
- Preserve HTML structure and tags
- Maintain consistent styling and formatting
- Use proper paragraph tags <p> for content
- Keep heading tags appropriate (H1, H2, H3)
- Ensure proper spacing and line breaks
- Return ONLY the modified content, no explanations or meta-commentary
- CRITICAL: Do NOT wrap the response in markdown code blocks
- Return raw HTML content directly without any markdown formatting
- Do NOT include any backticks in your response

Modified content:`
                    }]
                }]
            })
        });

        if (!modificationResponse.ok) {
            const errorText = await modificationResponse.text();
            console.error(`Gemini API modification error: ${modificationResponse.status} - ${errorText}`);
            throw new Error(`Gemini API modification error: ${modificationResponse.status} - ${errorText}`);
        }

        const modificationData = await modificationResponse.json();
        console.log('Gemini API modification response received successfully');
        
        if (!modificationData.candidates || !modificationData.candidates[0] || !modificationData.candidates[0].content || !modificationData.candidates[0].content.parts || !modificationData.candidates[0].content.parts[0]) {
            console.error('Invalid Gemini API modification response structure:', modificationData);
            throw new Error('Invalid response structure from Gemini API modification');
        }
        
        const modifiedContent = modificationData.candidates[0].content.parts[0].text.trim();
        console.log('Modified content length:', modifiedContent.length);

        // Step 3: Replace the extracted content with the modified content in the original blog
        let updatedBlogContent = existingContent;
        
        // Try direct replacement first
        if (existingContent.includes(extractedContent)) {
            updatedBlogContent = existingContent.replace(extractedContent, modifiedContent);
        } else {
            // If direct replacement fails, try to find and replace by content similarity
            const normalizeHtml = (html) => html.replace(/\s+/g, ' ').trim();
            const normalizedExtracted = normalizeHtml(extractedContent);
            const normalizedExisting = normalizeHtml(existingContent);
            
            if (normalizedExisting.includes(normalizedExtracted)) {
                // Find the original content with its original formatting
                const regex = new RegExp(extractedContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                updatedBlogContent = existingContent.replace(regex, modifiedContent);
            } else {
                // If still no match, try to identify and replace by HTML tag patterns
                // For headings specifically
                if (modificationRequest.toLowerCase().includes('heading') || 
                    modificationRequest.toLowerCase().includes('title') ||
                    modificationRequest.toLowerCase().includes('h1')) {
                    // Replace the main heading (h1 tag)
                    const h1Regex = /<h1[^>]*>.*?<\/h1>/gi;
                    const h1Match = existingContent.match(h1Regex);
                    if (h1Match && h1Match[0]) {
                        updatedBlogContent = existingContent.replace(h1Match[0], modifiedContent);
                    } else {
                        // Fallback: append the modified content
                        updatedBlogContent = modifiedContent + '\n\n' + existingContent;
                    }
                } else {
                    // For other content, try to replace the first significant paragraph or section
                    const firstParagraphRegex = /<p[^>]*>.*?<\/p>/i;
                    const firstParagraphMatch = existingContent.match(firstParagraphRegex);
                    if (firstParagraphMatch && firstParagraphMatch[0]) {
                        updatedBlogContent = existingContent.replace(firstParagraphMatch[0], modifiedContent);
                    } else {
                        // Ultimate fallback: replace entire content
                        updatedBlogContent = modifiedContent;
                    }
                }
            }
        }

        res.status(200).json({
            success: true,
            extractedContent: extractedContent,
            modifiedContent: modifiedContent,
            updatedBlogContent: updatedBlogContent,
            modificationRequest: modificationRequest,
            originalContent: existingContent,
            analysisDetails: {
                originalLength: existingContent.length,
                extractedLength: extractedContent.length,
                modifiedLength: modifiedContent.length,
                finalLength: updatedBlogContent.length
            }
        });

    } catch (error) {
        console.error('Error analyzing blog modification:', error);
        console.error('Error stack:', error.stack);
        
        // Provide more specific error messages
        let errorMessage = 'Internal server error while analyzing modification';
        if (error.message.includes('GEMINI_API_KEY')) {
            errorMessage = 'Gemini API key not configured. Please check your environment variables.';
        } else if (error.message.includes('Gemini API error: 401')) {
            errorMessage = 'Invalid Gemini API key. Please check your API key configuration.';
        } else if (error.message.includes('Gemini API error: 403')) {
            errorMessage = 'Gemini API access denied. Please check your API key permissions.';
        } else if (error.message.includes('Gemini API error: 429')) {
            errorMessage = 'Gemini API rate limit exceeded. Please try again later.';
        } else if (error.message.includes('fetch')) {
            errorMessage = 'Network error connecting to Gemini API. Please check your internet connection.';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message
        });
    }
});

// Test Gemini API connection
export const testGeminiAPI = catchAsync(async (req, res) => {
    try {
        // Check if GEMINI_API_KEY is available
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'GEMINI_API_KEY environment variable is not set'
            });
        }

        console.log('Testing Gemini API connection...');
        
        const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello, this is a test message. Please respond with "API is working correctly."'
                    }]
                }]
            })
        });

        if (!testResponse.ok) {
            const errorText = await testResponse.text();
            console.error(`Gemini API test error: ${testResponse.status} - ${errorText}`);
            return res.status(500).json({
                success: false,
                message: `Gemini API test failed: ${testResponse.status}`,
                error: errorText
            });
        }

        const testData = await testResponse.json();
        console.log('Gemini API test successful');

        res.status(200).json({
            success: true,
            message: 'Gemini API is working correctly',
            response: testData.candidates[0].content.parts[0].text
        });

    } catch (error) {
        console.error('Error testing Gemini API:', error);
        res.status(500).json({
            success: false,
            message: 'Error testing Gemini API',
            error: error.message
        });
    }
});
