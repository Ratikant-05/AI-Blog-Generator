import { catchAsync } from '../utils/catchAsync.js';
import Blog from '../Models/blogModel.js';
import dotenv from 'dotenv';
dotenv.config();

// Function to humanize text using Gemini API
async function humanizeText(text) {
    try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Humanize and enhance the following text to make it more natural, engaging, and readable while preserving the original meaning and structure:

${text}

Instructions:
You are an expert content humanizer and editor. Your task is to transform the given text into more natural, engaging, and human-like content.

HUMANIZATION GUIDELINES:

SENTENCE STRUCTURE:
- Vary sentence lengths for better flow (mix short, medium, and long sentences)
- Use natural transitions between ideas
- Add appropriate conjunctions and connecting words
- Break up overly complex sentences for clarity
- Ensure smooth paragraph transitions

TONE AND STYLE:
- Make the content conversational yet professional
- Add subtle personality without being overly casual
- Use active voice where appropriate
- Include rhetorical questions to engage readers
- Add emphasis through varied sentence structures

READABILITY ENHANCEMENTS:
- Add natural paragraph breaks every 3-5 sentences
- Use transitional phrases organically (Moreover, Furthermore, However, Additionally, etc.)
- Include examples or elaborations where beneficial
- Ensure logical flow of ideas
- Maintain consistent tone throughout

CONTENT IMPROVEMENTS:
- Expand on key points with relevant details
- Add context where helpful for understanding
- Include subtle calls-to-action or engagement elements
- Enhance clarity without changing core meaning
- Make technical content more accessible

FORMATTING REQUIREMENTS:
- Preserve any existing HTML tags or formatting
- Maintain proper paragraph structure
- Keep headings and subheadings intact
- Ensure consistent spacing and line breaks
- Return clean, well-formatted text

QUALITY STANDARDS:
- Ensure grammatical correctness
- Maintain factual accuracy
- Keep the original intent and message
- Make content more engaging and readable
- Add natural flow and rhythm

Return ONLY the humanized text without any explanations or meta-commentary:`
                    }]
                }]
            })
        });

        if (!geminiResponse.ok) {
            console.error('Gemini API error:', geminiResponse.status);
            // Fallback to basic humanization if API fails
            return basicHumanizeText(text);
        }

        const geminiData = await geminiResponse.json();
        const humanizedContent = geminiData.candidates[0].content.parts[0].text.trim();
        
        return humanizedContent;
    } catch (error) {
        console.error('Error humanizing text with Gemini:', error);
        // Fallback to basic humanization if API fails
        return basicHumanizeText(text);
    }
}

// Fallback basic humanization function
function basicHumanizeText(text) {
    // Add variations in sentence structure
    text = text.replace(/\. /g, '. \n');
    const sentences = text.split('\n').filter(s => s.trim());
    
    // Add transitional phrases
    const transitions = [
        'Moreover,', 'Furthermore,', 'Additionally,', 'In addition,',
        'However,', 'On the other hand,', 'Nevertheless,', 'Consequently,',
        'Therefore,', 'As a result,', 'Indeed,', 'Notably,'
    ];
    
    // Process each sentence
    const humanizedSentences = sentences.map((sentence, i) => {
        if (i > 0 && Math.random() < 0.3) {
            // 30% chance to add a transition
            const transition = transitions[Math.floor(Math.random() * transitions.length)];
            sentence = `${transition} ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
        }
        return sentence;
    });
    
    // Join sentences and add paragraph breaks
    let humanizedText = humanizedSentences.join(' ');
    
    // Add paragraph breaks every 4-6 sentences
    const paragraphBreakInterval = Math.floor(Math.random() * 3) + 4;
    humanizedText = humanizedSentences
        .reduce((acc, sentence, i) => {
            if (i > 0 && i % paragraphBreakInterval === 0) {
                return acc + '\n\n' + sentence;
            }
            return acc + ' ' + sentence;
        }, '')
        .trim();
    
    return humanizedText;
}

// Generate blog content using Gemini API
export const generateBlogContent = catchAsync(async (req, res) => {
    const { prompt, keywords } = req.body;

    if (!prompt) {
        return res.status(400).json({
            success: false,
            message: 'Blog topic/prompt is required'
        });
    }

    try {
        // Process keywords - use top 50 keywords if provided, otherwise use empty string
        let keywordString = '';
        if (keywords && Array.isArray(keywords) && keywords.length > 0) {
            // If keywords is an array of objects with keyword property, extract just the keywords
            const keywordList = keywords.map(k => typeof k === 'object' ? k.keyword : k);
            keywordString = keywordList.join(', ');
        }

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Okay, AI, from this point forward, you are an HTML Blog Generator.
Your sole purpose is to generate complete blog posts in HTML format based on the topics and requirements I provide.

Here are the strict rules for every blog post you generate:

Overall Output Format:
    The entire response MUST be a well-formed HTML snippet.
    Do not include any text or explanations outside of the HTML code itself, unless it's within HTML comments <!-- like this --> for your own structural notes if absolutely necessary (but preferably not).

Main Heading:
    The main blog title MUST be enclosed within an <h1> tag.
    The text of the heading itself (inside the <h1> tags) MUST NOT use any additional formatting tags like <b> or <strong>.
    The heading must be UNIQUE and MUST NOT BE SIMILAR TO THE USER'S PROMPT.
        
    Example: <h1>This is the Main Blog Title</h1>

    VERY IMPORTANT: REMOVE ALL THE EMPTY <p> tags.

    Topic Description (Post-Heading):
    Immediately following the <h1> heading, you MUST provide a descriptive paragraph of approximately 100 words about the main topic of the blog.
    This description should be enclosed in <p> tags.
    
    Subheadings:
    IMPORTANT: There must be atleast 3 subheadings.
    The blog post MUST include relevant subheadings to structure the content.
    Each subheading MUST be enclosed within an <h3> tag.
    Example: <h3>This is a Subheading</h3>

    Subheading Content:
    Immediately following each <h3> subheading, you MUST provide a detailed description or elaboration related to that subheading.
    This content for each subheading should be approximately 100-150 words long.
    This content should be enclosed in <p> tags.

    Conclusion:
    The blog post MUST end with a conclusion section.
    The title or introductory phrase for the conclusion (e.g., "Conclusion," "Final Thoughts," "In Summary") MUST be enclosed within an <h2> tag.
    Example: <h2>Conclusion</h2>
    IMPORTANT: the conclusion should be 100-150 words.
    The actual concluding paragraphs (summarizing key points, offering a final thought, or a call to action) should follow this <h2> tag, enclosed in <p> tags.
    
    Structure and Cleanliness:
    The entire blog post must be well-structured and logically organized.
    CRITICALLY IMPORTANT: Your HTML output must be clean. This means:

    NO unnecessary asterisks (*).
    NO unnecessary hash symbols (#).
    NO unnecessary leading/trailing spaces within text content.
    IMPORTANT: IF THERE ARE "\\n" twice remove it.
    NO unnecessary extra line breaks or spaces between HTML tags unless it genuinely improves readability of the raw HTML (e.g., indenting nested elements is fine, but random blank lines between paragraphs are not).
    Use standard HTML tags like <p> for paragraphs.

    IMPORTANT: The blog post must be 3000 words or more.
    VERY IMPORTANT: Remove the empty paragraphs of the blog post.
    VERY IMPORTANT: The blog post must be in A4 format.

    IMPLEMENTING placeholder image: 
    VERY IMPORTANT: Add assets/placeholder.svg to the blog at random places(Just not after the conclusion).
    1. Ensure only three placeholders are added to the whole blog. 
    2. STRICT: It must have the css property of float.
    3. The size of the assets/placeholder.svg image must be 400x400.
    VERY IMPORTANT: Give me the placeholder with class="placeholder-image".

    VERY IMPORTANT: You must naturally incorporate the following keywords throughout the blog content in a way that maintains readability and flow:
    ${keywordString}

    Generate the complete blog post in HTML format for this topic: ${prompt}`
                    }]
                }]
            })
        });

        if (!geminiResponse.ok) {
            throw new Error(`Gemini API error: ${geminiResponse.status}`);
        }

        const geminiData = await geminiResponse.json();
        const generatedContent = geminiData.candidates[0].content.parts[0].text.trim();

        res.status(200).json({
            success: true,
            content: generatedContent,
            prompt: prompt
        });

    } catch (error) {
        console.error('Error generating blog content:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating blog content',
            error: error.message
        });
    }
});

// Refine prompt for keyword generation using Gemini API
export const refinePromptForKeywords = catchAsync(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({
            success: false,
            message: 'Prompt is required'
        });
    }

    try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Refine this blog topic into 3-5 seed keywords for keyword research:

Topic: ${prompt}

Instructions:
- Extract the main concepts and themes from the topic
- Create 3-5 seed keywords that are relevant for SEO research
- Each keyword should be 2-4 words long
- Focus on terms that people would search for
- Return only the keywords, one per line, no explanations

Example format:
keyword 1
keyword 2
keyword 3

Refined keywords:`
                    }]
                }]
            })
        });

        if (!geminiResponse.ok) {
            throw new Error(`Gemini API error: ${geminiResponse.status}`);
        }

        const geminiData = await geminiResponse.json();
        const refinedKeywords = geminiData.candidates[0].content.parts[0].text.trim();

        res.status(200).json({
            success: true,
            keywords: refinedKeywords,
            prompt: prompt
        });

    } catch (error) {
        console.error('Error refining prompt for keywords:', error);
        res.status(500).json({
            success: false,
            message: 'Error refining prompt for keywords',
            error: error.message
        });
    }
});

// Create a new blog
export const createBlog = catchAsync(async (req, res) => {
    // Add the authenticated user as the author
    const blog = await Blog.create({
        ...req.body,
        author: req.user._id
    });

    res.status(201).json({
        status: 'success',
        data: {
            blog
        }
    });
});

// Get all blogs
export const getAllBlogs = catchAsync(async (req, res) => {
    const blogs = await Blog.find()
        .populate({
            path: 'author',
            select: 'fullName email profilePicture'
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: blogs.length,
        data: {
            blogs
        }
    });
});

// Get user's blogs
export const getUserBlogs = catchAsync(async (req, res) => {
    const blogs = await Blog.find({ author: req.user._id })
        .sort('-createdAt')
        .lean(); // Convert to plain JavaScript objects

    // Send the blogs array directly as the frontend expects
    res.status(200).json(blogs);
});

// Get a single blog
export const getBlog = catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate({
            path: 'author',
            select: 'fullName email profilePicture'
        });

    if (!blog) {
        return res.status(404).json({
            status: 'error',
            message: 'Blog not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            blog
        }
    });
});

// Update a blog
export const updateBlog = catchAsync(async (req, res) => {
    const blog = await Blog.findOneAndUpdate(
        { _id: req.params.id, author: req.user._id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!blog) {
        return res.status(404).json({
            status: 'error',
            message: 'Blog not found or you are not authorized to update it'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            blog
        }
    });
});

// Delete a blog
export const deleteBlog = catchAsync(async (req, res) => {
    const blog = await Blog.findOneAndDelete({
        _id: req.params.id,
        author: req.user._id
    });

    if (!blog) {
        return res.status(404).json({
            status: 'error',
            message: 'Blog not found or you are not authorized to delete it'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});


// Humanize blog content
export const humanizeBlogContent = catchAsync(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({
            status: 'error',
            message: 'Content is required'
        });
    }

    try {
        const humanizedContent = await humanizeText(content);

        res.status(200).json({
            status: 'success',
            data: {
                humanizedContent
            }
        });
    } catch (error) {
        console.error('Error humanizing content:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to humanize content',
            error: error.message
        });
    }
}); 

// Get a specific blog with chat history for restoration
export const getBlogWithChatHistory = catchAsync(async (req, res) => {
    const blogId = req.params.id;
    const userId = req.user._id;


    const blog = await Blog.findOne({ _id: blogId, author: userId });

    if (!blog) {
        return res.status(404).json({
            status: 'fail',
            message: 'Blog not found'
        });
    }


    res.status(200).json({
        status: 'success',
        data: {
            blog: {
                _id: blog._id,
                title: blog.title,
                content: blog.content,
                category: blog.category,
                summary: blog.summary,
                keywords: blog.keywords,
                chatHistory: blog.chatHistory,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt
            }
        }
    });
});

// Update blog chat history
export const updateBlogChatHistory = catchAsync(async (req, res) => {
    const blogId = req.params.id;
    const { content, type, metadata } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!content || !type) {
        return res.status(400).json({
            status: 'fail',
            message: 'Content and type are required'
        });
    }

    // Validate type enum
    if (!['user', 'ai'].includes(type)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Type must be either "user" or "ai"'
        });
    }

    // Validate blogId format
    if (!blogId || !blogId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid blog ID format'
        });
    }

    try {
        const blog = await Blog.findOne({ _id: blogId, author: userId });

        if (!blog) {
            return res.status(404).json({
                status: 'fail',
                message: 'Blog not found'
            });
        }

        // Initialize chatHistory array if it doesn't exist
        if (!blog.chatHistory) {
            blog.chatHistory = [];
        }

        // Add the new message to chat history with metadata
        const chatMessage = {
            content: content.trim(),
            type,
            timestamp: new Date()
        };

        // Add metadata if provided (for images, etc.)
        if (metadata && Object.keys(metadata).length > 0) {
            // Store metadata as a plain object instead of Map to ensure JSON serialization works
            chatMessage.metadata = { ...metadata };
        }

        blog.chatHistory.push(chatMessage);

        await blog.save();

        res.status(200).json({
            status: 'success',
            data: {
                message: 'Chat history updated successfully',
                chatHistory: blog.chatHistory
            }
        });
    } catch (error) {
        console.error('Error updating blog chat history:', error);
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error while updating chat history'
        });
    }
});