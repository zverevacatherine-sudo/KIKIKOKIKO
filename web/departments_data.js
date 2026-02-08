// Departments data - converted from Python
const Departments = [
    {
        id: "1",
        title: "Authority 'Know & Understand'",
        image: "PICS/Departaments/D1.png",
        stop_x: 900,
        y: 120,
        questions: [
            ["Which of the following best describes 'Generative AI'?",
             [
                 "AI that creates new content like text, images, or music by learning from existing data",
                 "An AI system designed to enhance the speed and accuracy of data retrieval in search engines",
                 "A form of artificial intelligence that focuses on translating languages in real-time",
                 "AI technology used primarily for managing and organizing large databases"
             ], 0],

            ["Which of the following statements best describes an LLM (Large Language Model)?",
             [
                 "It generates text by analyzing and summarizing large volumes of web content",
                 "It generates text by predicting the next word based on the context of previous words",
                 "It generates text by translating input text into multiple languages simultaneously",
                 "It generates text by using pre-defined templates and filling in the blanks"
             ], 1],

            ["Which of the following tasks can Generative AI perform with a high degree of accuracy?",
             [
                 "Predicting stock market trends",
                 "Making ethical decisions in complex scenarios",
                 "Diagnosing rare diseases",
                 "Generating human-like text based on prompts"
             ], 3],

            ["In the context of Generative AI, what is 'zero-shot learning'?",
             [
                 "Training a model without any data",
                 "The ability of a model to perform a task without any task-specific training",
                 "A method of reducing the model's training time to zero",
                 "A technique for generating synthetic training data"
             ], 1],

            ["Which of the following is a potential challenge when using prompt-based development for text generation?",
             [
                 "The language model can only generate binary outputs",
                 "The need for extensive labelled data to train the model",
                 "Crafting a prompt that accurately captures the desired context and nuances",
                 "The requirement for complex feature engineering"
             ], 2],

            ["What does the term 'token' refer to in the context of a large language model (LLM)?",
             [
                 "A token is a unit of text, such as a word or a subword, that the model processes individually",
                 "A token is a unique identifier assigned to each user interacting with the language model",
                 "A token is a security measure used to authenticate API requests to the language model",
                 "A token is a reward given to users for contributing valuable data to train the language model"
             ], 0],

            ["Which of the following is NOT a requirement for an AI to be considered artificial general intelligence (AGI)?",
             [
                 "The ability to learn and adapt to new tasks without human intervention",
                 "The capability to perform tasks across various domains with human-like proficiency",
                 "The ability to predict future events with perfect accuracy",
                 "The capacity to understand and generate natural language"
             ], 2],

            ["How does RAG (Retrieval-Augmented Generation) enhance the capabilities of an LLM?",
             [
                 "By improving its grammar and syntax",
                 "By providing it with real-time and relevant data",
                 "By increasing its computational speed",
                 "By enabling it to understand multiple languages"
             ], 1],
        ]
    },

    {
        id: "2",
        title: "Authority 'Use & Apply'",
        image: "PICS/Departaments/D2.png",
        stop_x: 900,
        y: 240,
        questions: [
            ["When using generative AI to create a marketing pitch, which of the following strategies is least likely to be effective?",
             [
                 "Supplying the AI with information about the target audience",
                 "Asking the AI to include unique selling points and benefits",
                 "Requesting the AI to use persuasive language techniques",
                 "Providing the AI with a list of competitors' products"
             ], 3],

            ["After deploying a customer service chatbot, you notice that it frequently provides outdated information about company policies. What is the best course of action to address this issue?",
             [
                 "Implement a feedback loop where users can flag outdated information for review",
                 "Schedule regular updates to the chatbot's training data to include the latest company policies",
                 "Set up a system where complex or policy-related queries are escalated to human agents for accurate responses",
                 "Conduct a comprehensive audit of the chatbot's performance metrics to identify areas for improvement"
             ], 1],

            ["Suppose you have a large dataset of emails and you want to build an application to answer questions based on this dataset. Which of the following scenarios best illustrates the advantage of using RAG over prompting (i.e without RAG)?",
             [
                 "You need to generate creative writing pieces based on the email content",
                 "You want to ensure the model can answer questions even if it has never seen similar questions before",
                 "You need to answer questions that require specific information from different parts of the email dataset",
                 "You want to reduce the size of the language model to save computational resources"
             ], 2],
        ]
    },

    {
        id: "3",
        title: "Authority 'Evaluate & Create'",
        image: "PICS/Departaments/D3.png",
        stop_x: 900,
        y: 360,
        questions: [
            ["As a student using a Large Language Model (LLM) to gather information for an assignment, how should you approach the information it provides?",
             [
                 "The LLM's answers are always more trustworthy than any information you will find on the internet, so you can use them without further verification",
                 "The LLM's answers are generally more trustworthy than internet sources, but you should still verify the information with other reliable sources",
                 "The LLM's answers are not necessarily more trustworthy than internet sources, and you should cross-check the information with other credible references",
                 "The LLM's answers are less trustworthy than internet sources because it relies on outdated information"
             ], 2],

            ["It is unlikely for an LLM to provide an accurate summary of the latest financial market trends in real-time. Is this statement true or false?",
             [
                 "True, because the LLM's data may be outdated due to its knowledge cutoff",
                 "True, because the LLM is not good at handling numbers and structured data",
                 "False, because the LLM frequently updates its knowledge base",
                 "False, because the LLM is capable of synthesizing the latest market data automatically"
             ], 0],

            ["A generative AI tool has provided a summary of a research paper. The summary states, \"The study found that increased screen time is directly correlated with decreased attention spans in children aged 8–12.\" What is your next step?",
             [
                 "Accept the summary as accurate because AI tools are generally reliable",
                 "Ask the AI to provide more details about the study's methodology and results",
                 "Cross-check the summary with the original research paper",
                 "Use another AI tool to generate a summary for comparison and evaluate the consistency between both summaries"
             ], 2],

            ["While reviewing a video of a well-known public figure making controversial statements, which characteristic confirms the video was NOT generated by AI?",
             [
                 "The public figure's voice sounds like themselves",
                 "The video has a professional and polished appearance",
                 "The video is high-quality with smooth transitions",
                 "None of the above"
             ], 3],
        ]
    },

    {
        id: "4",
        title: "Authority 'Ethics'",
        image: "PICS/Departaments/D4.png",
        stop_x: 900,
        y: 480,
        questions: [
            ["When a generative AI system is used for screening job applications, what issue might arise concerning the quality and fairness of hiring decisions?",
             [
                 "The AI system might overlook applicants' unique achievements and extracurricular activities",
                 "The AI system could misinterpret minor formatting differences in resumes",
                 "The AI system might not effectively handle applications submitted in various languages",
                 "The AI system could reinforce existing biases found in historical hiring data"
             ], 3],

            ["In a healthcare startup, an accurate AI model recommends treatments, but doctors don't trust it because they can't understand how the model arrived at its conclusions. What core issue does this scenario illustrate?",
             [
                 "The AI model uses obsolete training data",
                 "The training dataset lacks sufficient diversity",
                 "The treatment guidelines input are incorrect",
                 "The AI model behaves as a black box"
             ], 3],

            ["What are the potential copyright implications for a journalist using an AI-generated image in a commercial article?",
             [
                 "The journalist needs to check the licensing policy of the AI tool they used",
                 "The AI-generated image is automatically free to use without any restrictions",
                 "The journalist must pay a standard licensing fee to use the AI-generated image",
                 "The image cannot be used in any commercial context because it is AI-generated"
             ], 0],

            ["Should we impose restrictions on the outputs of generative AI technologies?",
             [
                 "Yes, to reduce the computational resources required for operating these technologies",
                 "Yes, to prevent the dissemination of harmful or misleading content",
                 "No, as it would hinder technological innovation and creativity",
                 "No, because users should have the freedom to access all generated content"
             ], 1],

            ["Sending personal information to cloud-based generative AI tools has little privacy concerns. Is this statement true or false?",
             [
                 "True, as this information is encrypted using sophisticated algorithms during the transmission process",
                 "True, as generative AI tools are black-box systems and cannot output personal information even if it is used for model training",
                 "False, as generative AI tools can train on unencrypted data and can output private information based on their probabilistic nature",
                 "False, as advancements in quantum computing can easily decipher the encrypted data"
             ], 2],
        ]
    },
];

