// ========================================
// SUBJECT-SPECIFIC DATA FOR E² TOOLS
// Integration with Pathways Platform
// ========================================

const SUBJECT_DATA = {
    math: {
          name: "Mathematics",
          color: "#4A90E2",
          objectives: [
                  "Develop computational fluency and procedural understanding",
                  "Build conceptual understanding of mathematical principles",
                  "Apply mathematical thinking to solve real-world problems",
                  "Develop reasoning and proof skills",
                  "Communicate mathematical ideas clearly",
                  "Make connections between mathematical concepts",
                  "Build confidence in mathematical abilities"
                ],
          materials: [
                  "Manipulatives (base-ten blocks, algebra tiles, counters)",
                  "Graphing tools and coordinate grids",
                  "Number lines and measurement tools",
                  "Problem-solving task cards",
                  "Real-world scenarios and applications",
                  "Geometric models and 3D shapes",
                  "Technology: graphing calculators, GeoGebra, Desmos"
                ],
          assessmentTypes: [
                  "Computational fluency checks",
                  "Conceptual understanding probes",
                  "Problem-solving portfolios",
                  "Mathematical reasoning tasks",
                  "Error analysis activities",
                  "Performance tasks with multiple entry points"
                ],
          engagementStrategies: [
                  "Problem-based learning with authentic contexts",
                  "Collaborative mathematical discourse",
                  "Concrete → Pictorial → Abstract (CPA) progression",
                  "Multiple representations of the same concept",
                  "Student-generated examples and counterexamples",
                  "Mathematical games and puzzles"
                ],
          differentiationTips: [
                  "Provide manipulatives for visual/kinesthetic learners",
                  "Offer open-ended vs. scaffolded versions of tasks",
                  "Use anchor tasks with natural entry and exit points",
                  "Vary problem contexts (sports, cooking, games, etc.)",
                  "Pre-teach vocabulary and prerequisite skills",
                  "Offer extension challenges and investigations"
                ]
    },

    science: {
          name: "Science",
          color: "#7ED321",
          objectives: [
                  "Develop scientific inquiry and investigation skills",
                  "Build understanding of scientific concepts and principles",
                  "Apply science knowledge to real-world situations",
                  "Develop critical thinking about evidence",
                  "Understand the nature of science and scientific thinking",
                  "Build connections between science disciplines",
                  "Foster curiosity and wonder about the natural world"
                ],
          materials: [
                  "Laboratory equipment (beakers, graduated cylinders, thermometers)",
                  "Safety equipment (goggles, lab coats, gloves)",
                  "Natural materials (soil, plants, insects, rocks)",
                  "Models and diagrams (atom models, planetary models)",
                  "Technology: microscopes, probes, data loggers",
                  "Dissection specimens or digital alternatives",
                  "Field guides and observation journals"
                ],
          assessmentTypes: [
                  "Lab reports and scientific investigations",
                  "Observation checklists and field journals",
                  "Data analysis and interpretation tasks",
                  "Concept mapping and diagramming",
                  "Explanations of phenomena",
                  "Design challenges and engineering tasks"
                ],
          engagementStrategies: [
                  "Hands-on investigations and experiments",
                  "Phenomena-based learning cycles",
                  "Student-designed investigations",
                  "Outdoor exploration and field work",
                  "Technology simulations and virtual labs",
                  "Science debates and argumentation"
                ],
          differentiationTips: [
                  "Provide graphic organizers for note-taking",
                  "Offer guided vs. open-ended investigations",
                  "Use anchoring phenomena at different levels",
                  "Provide vocabulary walls and glossaries",
                  "Offer tactile and visual models",
                  "Connect to students' interests and communities"
                ]
    },

    english: {
          name: "English Language Arts",
          color: "#F5A623",
          objectives: [
                  "Develop reading comprehension and fluency",
                  "Build writing skills across genres",
                  "Strengthen communication and presentation skills",
                  "Deepen literary analysis and interpretation",
                  "Develop critical thinking about media and texts",
                  "Build vocabulary and language structures",
                  "Foster love of reading and writing"
                ],
          materials: [
                  "Diverse literature (novels, short stories, poetry, drama)",
                  "Mentor texts for writing models",
                  "Graphic novels and visual texts",
                  "News articles and primary documents",
                  "Writing rubrics and checklists",
                  "Reading guides and comprehension tools",
                  "Recording equipment for presentations"
                ],
          assessmentTypes: [
                  "Reading comprehension quizzes",
                  "Written responses and essays",
                  "Literary analysis papers",
                  "Creative writing pieces",
                  "Presentations and oral reports",
                  "Reading journals and reflections",
                  "Collaborative projects and discussions"
                ],
          engagementStrategies: [
                  "Book clubs and literature circles",
                  "Readers theatre and dramatic readings",
                  "Writing workshops with peer feedback",
                  "Author studies and connections",
                  "Student choice in texts and topics",
                  "Real audiences for student writing",
                  "Multimedia storytelling projects"
                ],
          differentiationTips: [
                  "Offer texts at varying reading levels",
                  "Provide audio versions of texts",
                  "Use graphic organizers for writing",
                  "Offer dictation and speech-to-text tools",
                  "Provide sentence stems and writing templates",
                  "Allow choice in genres and topics"
                ]
    },

    history: {
          name: "History & Social Studies",
          color: "#BD10E0",
          objectives: [
                  "Develop historical thinking and analysis skills",
                  "Build understanding of major historical events and periods",
                  "Understand cause and effect in history",
                  "Develop perspective-taking and empathy",
                  "Build civic and social understanding",
                  "Develop research and evidence evaluation skills",
                  "Connect past to present and future"
                ],
          materials: [
                  "Primary documents (letters, newspapers, photographs)",
                  "Secondary sources (textbooks, articles, videos)",
                  "Maps (political, thematic, historical)",
                  "Timelines and chronological tools",
                  "Artifacts and museum resources",
                  "Oral histories and interviews",
                  "Documentary films and digital resources"
                ],
          assessmentTypes: [
                  "Document analysis tasks",
                  "Historical essays and arguments",
                  "Timeline creation and interpretation",
                  "Museum-style exhibits and presentations",
                  "DBQ (Document-Based Questions)",
                  "Perspective-taking assignments",
                  "Research projects and presentations"
                ],
          engagementStrategies: [
                  "Debate and discussion of historical events",
                  "Roleplay and historical simulations",
                  "Primary source analysis and interpretation",
                  "Oral history projects",
                  "Virtual field trips and museum tours",
                  "Student-created documentaries",
                  "Connection to current events"
                ],
          differentiationTips: [
                  "Provide multiple text formats (audio, video, written)",
                  "Offer simplified and complex versions of sources",
                  "Use graphic organizers for analysis",
                  "Provide vocabulary support for historical terms",
                  "Offer choice in perspective and topics",
                  "Include local and personal history connections"
                ]
    },

    stem: {
          name: "STEM & Engineering",
          color: "#2196F3",
          objectives: [
                  "Develop engineering design thinking",
                  "Build problem-solving and innovation skills",
                  "Apply science and technology to real challenges",
                  "Develop project management skills",
                  "Build collaboration and teamwork abilities",
                  "Understand connection between STEM disciplines",
                  "Foster entrepreneurial thinking"
                ],
          materials: [
                  "Building materials (cardboard, wood, plastic)",
                  "Electronics (Arduino, LEGOs, circuits)",
                  "Tools (hand tools, measuring instruments)",
                  "3D printers and design software",
                  "Robotics kits and components",
                  "Materials for prototyping",
                  "Design thinking worksheets"
                ],
          assessmentTypes: [
                  "Design portfolio documentation",
                  "Prototype evaluation and testing",
                  "Engineering reports",
                  "Peer and user feedback analysis",
                  "Iteration and improvement documentation",
                  "Presentation pitches",
                  "Collaboration and teamwork assessment"
                ],
          engagementStrategies: [
                  "Design challenges with real-world contexts",
                  "Maker spaces and hands-on building",
                  "Iterative design and prototyping",
                  "Failure as learning opportunity",
                  "Collaboration with local industries",
                  "Showcase and exhibition opportunities",
                  "Entrepreneurial projects"
                ],
          differentiationTips: [
                  "Offer scaffolded design challenges",
                  "Provide templates and design guides",
                  "Use mixed-ability teams strategically",
                  "Offer choice in tools and materials",
                  "Provide video tutorials and examples",
                  "Connect to student interests and careers"
                ]
    },

    languages: {
          name: "World Languages",
          color: "#FF6B6B",
          objectives: [
                  "Develop communicative competence in target language",
                  "Build listening, speaking, reading, and writing skills",
                  "Understand cultural practices and perspectives",
                  "Develop cross-cultural communication skills",
                  "Build confidence in language use",
                  "Make connections to target language cultures",
                  "Foster lifelong language learning"
                ],
          materials: [
                  "Authentic media (music, films, podcasts in target language)",
                  "Literature in target language",
                  "Digital pen pals and email exchanges",
                  "Language learning apps and software",
                  "Vocabulary visual aids and flashcards",
                  "Grammar explanation guides",
                  "Role-play scenario cards"
                ],
          assessmentTypes: [
                  "Oral proficiency interviews",
                  "Listening comprehension tasks",
                  "Written compositions",
                  "Cultural presentations",
                  "Interactive dialogues",
                  "Presentation projects",
                  "Reflection on cultural learning"
                ],
          engagementStrategies: [
                  "Immersion activities and scenarios",
                  "Authentic communication with target language speakers",
                  "Cultural celebrations and events",
                  "Media consumption (movies, music, news)",
                  "Storytelling and narrative creation",
                  "Language exchange partnerships",
                  "Community service in target language"
                ],
          differentiationTips: [
                  "Offer input at comprehensible levels",
                  "Provide vocabulary pre-teaching",
                  "Use visual supports and gestures",
                  "Offer choice in communication tasks",
                  "Pair learners strategically for dialogue",
                  "Provide sentence frames and language chunks"
                ]
    },

    arabic: {
          name: "Arabic & Islamic Studies",
          color: "#009688",
          objectives: [
                  "Develop proficiency in Modern Standard Arabic (MSA) or dialect",
                  "Build Quranic literacy and comprehension",
                  "Understand Islamic history and civilization",
                  "Develop cultural and religious understanding",
                  "Build identity and cultural pride",
                  "Develop academic discourse skills",
                  "Foster critical thinking about texts and traditions"
                ],
          materials: [
                  "Quran with translations and tafsir (interpretation)",
                  "Hadith collections and explanations",
                  "Arabic grammar texts and practice materials",
                  "Islamic history books and timelines",
                  "Arabic literature and poetry",
                  "Calligraphy examples and tutorials",
                  "Digital Quran and Islamic learning apps"
                ],
          assessmentTypes: [
                  "Quranic memorization and recitation",
                  "Arabic language proficiency tests",
                  "Tafsir (interpretation) essays",
                  "Islamic history projects",
                  "Calligraphy and art creations",
                  "Discussions of Islamic principles",
                  "Research papers on Islamic topics"
                ],
          engagementStrategies: [
                  "Quranic recitation study circles (halaqat)",
                  "Islamic heritage month celebrations",
                  "Calligraphy and Islamic art projects",
                  "Guest speakers from Islamic community",
                  "Islamic history simulations",
                  "Debate and discussion of Islamic principles",
                  "Service projects aligned with Islamic values"
                ],
          differentiationTips: [
                  "Offer transliterations alongside Arabic script",
                  "Provide translations and meanings",
                  "Use multimedia Quranic resources",
                  "Respect different Islamic traditions and interpretations",
                  "Connect to students' family and cultural practices",
                  "Offer choice in Arabic dialect and modern vs. classical"
                ]
    }
};

// ========================================
// PREMIUM TIER DATA
// ========================================

const PREMIUM_FEATURES = {
    free: {
          name: "Free Tier",
          features: [
                  "Access to all 5 lesson planning tools",
                  "Basic lesson planner with standard objectives",
                  "Simple rubric templates",
                  "Save to browser localStorage",
                  "Export as text"
                ],
          limitations: [
                  "Limited subject suggestions",
                  "No cloud sync",
                  "Basic templates only"
                ]
    },

    premium: {
          name: "Premium (Individual Teacher)",
          features: [
                  "All free features",
                  "Subject-specific suggestion sets for all 6+ subjects",
                  "Advanced rubric templates with standards alignment",
                  "Cloud storage and sync across devices",
                  "Export to PDF, Google Docs, Microsoft Word",
                  "Create and save custom templates",
                  "Priority email support",
                  "Monthly teaching resources newsletter"
                ],
          limitations: []
    },

    school: {
          name: "School License",
          features: [
                  "All premium features for unlimited teachers",
                  "School-wide collaboration features",
                  "Admin dashboard for managing teachers",
                  "Curriculum mapping tools",
                  "Standards alignment (state/national standards)",
                  "Professional development resources",
                  "Custom branding (school logo, colors)",
                  "LMS integration (Canvas, Classroom, Schoology)",
                  "Analytics dashboard showing usage",
                  "24/7 phone and email support",
                  "Annual training and onboarding"
                ],
          limitations: []
    }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

function getSubjectData(subject) {
    const key = subject.toLowerCase();
    return SUBJECT_DATA[key] || null;
}

function getPremiumFeatures(tier) {
    return PREMIUM_FEATURES[tier] || PREMIUM_FEATURES.free;
}

function getSubjects() {
    return Object.keys(SUBJECT_DATA).map(key => ({
          key: key,
          name: SUBJECT_DATA[key].name,
          color: SUBJECT_DATA[key].color
    }));
}

// ========================================
// EXPORT FOR USE IN E² TOOLS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUBJECT_DATA, PREMIUM_FEATURES, getSubjectData, getPremiumFeatures, getSubjects };
}
