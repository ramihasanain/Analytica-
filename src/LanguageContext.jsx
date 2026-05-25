import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const translations = {
  ar: {
    // Nav
    navFeatures: "المزايا العصرية",
    navHowItWorks: "آلية العمل",
    navPricing: "خطط الأسعار",
    navLogin: "تسجيل الدخول",
    navStartFree: "ابدأ مجاناً",
    navBrand: "بولس",

    // Hero
    heroBadge: "التحديث الجديد لمستقبل الأعمال",
    heroTitle1: "اقرأ أفكار عملائك",
    heroTitle2: "بدقّة لا تُضاهى",
    heroDesc: "نظام ذكي يراقب صفحاتك على السوشيال ميديا على مدار الساعة، يقرأ تعليقات جمهورك، ويخبرك فوراً بمدى رضاهم عن خدماتك لتتخذ القرار الصحيح.",
    heroCTA: "اربط حساباتك الآن",
    heroHow: "كيف نعمل؟",

    // Terminal
    termHeader: "عينك الذكية على عملائك",
    termInit: "> تجهيز النظام لجمع البيانات... [نجاح]",
    termAlert: "[تنبيه مباشر] سحب آلاف التعليقات من فيسبوك و X",
    termCommentTitle: "التعليق الأحدث:",
    termCommentBody: '"تجربة الشراء منكم كانت مذهلة والمنتج رائع!"',
    termAnalysisResult: "نتيجة التحليل الذكي:",
    termMood: "المزاج: سعيد جداً 😊",
    termTopic: "الموضوع: جودة الخدمة",
    termConfidence: "مدى اليقين: 99.2%",
    termWaiting: "> جاري انتظار تعليقات أخرى...",
    termCard1Title: "دقة فهم اللهجات العربية",
    termCard1Value: "99.8%",
    termCard2Title: "التعليقات المفحوصة اليوم",
    termCard2Value: "14 ألف",

    // Trust Badges
    trustBadge1: "ثقة وآمان",
    trustBadge2: "خصوصية تامة",
    trustBadge3: "دقة لا متناهية",
    trustBadge4: "استثمار ذكي",
    trustBadge5: "سرعة الأداء",

    // How It Works
    howTitle1: "خطوات بسيطة ونتيجة فورية",
    howTitle2: "كيف يعمل نظامنا المستقبلي؟",
    howDesc: "العملية كاملة لا تستغرق سوى دقائق لتكون لوحة القيادة البصرية بين يديك لتستكشف أفكار جمهورك بوضوح تام.",
    step1Title: "ربط حساباتك بسهولة",
    step1Desc: "بخطوات بسيطة وبدون أي تعقيد، قم بربط صفحاتك التجارية على فيسبوك وحسابك على X لتبدأ رحلة فهم عملائك والاقتراب منهم أكثر.",
    step2Title: "مراقبة هادئة على مدار الساعة",
    step2Desc: "يعمل نظامنا الذكي بصمت خلف الكواليس، حيث يقوم بجمع وسحب آلاف التعليقات والمنشورات الجديدة من قنواتك باستمرار.",
    step3Title: "قراءة وفهم مشاعر العملاء",
    step3Desc: "يقوم الذكاء الاصطناعي بقراءة كل تعليق مهما كانت لهجته، لتحديد ما إذا كان العميل سعيداً، غاضباً، أو محايداً، مع فهم الموضوع الذي يتحدث عنه.",
    step4Title: "تحويل البيانات إلى قرارات ناجحة",
    step4Desc: "نجمع كل هذه التحليلات العميقة ونرتبها أمامك في لوحة تحكم واحدة، بسيطة وواضحة جداً وبألوان ورسوم جذابة ترشدك لاتخاذ القرار الصحيح.",

    // Features
    featuresTitle1: "إمكانيات مدهشة لعملك",
    featuresTitle2: "لوحة التحكم التي تحتاجها شركتك",
    featuresDesc: "مجموعة متكاملة من الأدوات التي تجعل متابعة عملائك سهلة وممتعة، وتساعدك على تحسين جودة خدماتك باستمرار.",
    feature1Title: "سحب التعليقات تلقائياً",
    feature1Desc: "نظام لا ينام أبداً، يبحث باستمرار عن أي تعليق أو ذكر لشركتك على صفحاتك المتعددة ويجلبها لك بترتيب ووضوح.",
    feature2Title: "فهم حالة العميل المزاجية",
    feature2Desc: "نحلل الكلمات ونفهم اللهجات الدارجة لنخبرك فوراً وبدقة ممتازة عن نسبة الرضا، الثناء، المنشورات المحايدة، أو الانزعاج والغضب.",
    feature3Title: "اكتشاف ما يهم جمهورك",
    feature3Desc: "يصنّف لك النظام من تلقاء نفسه أكثر المواضيع تكراراً (مثل التأخير في التوصيل أو جودة المنتجات) لتتدخل في الوقت المناسب.",
    feature4Title: "مقارنة المنصات المختلفة",
    feature4Desc: "شاهد بوضوح وسهولة الفرق بين تفاعل زوارك على فيسبوك وتفاعلهم على منصة X لتتخذ قرارات تسويقية أذكى توفر ميزانيتك.",
    feature5Title: "تقارير جاهزة بنقرة واحدة",
    feature5Desc: "لا حاجة للتلخيص اليدوي المزعج، حوّل كل هذه الأرقام إلى تقارير PDF جميلة واحترافية لمشاركتها مع الموظفين بثانية واحدة.",
    feature6Title: "لوحة تحكم خفيفة ومريحة",
    feature6Desc: "مهما كانت الشاشة الأمامية مبهرة، صممنا لك نظاماً داخلياً باللون الفاتح والمريح للعين، تقضي فيه وقت العمل بدون إرهاق.",

    // Pricing
    pricingTitle1: "الاستثمار الذكي المعقول",
    pricingTitle2: "باقات مصممة لنمو أعمالك",
    pricingDesc: "اختر الخطة التي تناسب نشاطك التجاري الآن، واستمتع بصناعة قرارات تسويقية صائبة تقلل الخسائر وترفع المبيعات بشكل ملحوظ.",
    pricingPopular: "الباقة الأكثر شعبية",
    pricingFreeName: "مجاني",
    pricingFreePeriod: "للأبد",
    pricingFreeDesc: "مثالي لتجربة المنصة قبل الالتزام",
    pricingProName: "احترافي",
    pricingProPeriod: "/ شهرياً",
    pricingProDesc: "للشركات الناشئة التي تريد فهم جمهورها",
    pricingEnterpriseName: "مؤسسات",
    pricingEnterprisePeriod: "/ شهرياً",
    pricingEnterpriseDesc: "للشركات الكبيرة التي تدير عدة علامات تجارية",

    // Pricing Features List
    pricingFeatureFree1: "صفحة واحدة (فيسبوك أو X)",
    pricingFeatureFree2: "تحديث البيانات يومياً",
    pricingFeatureFree3: "تحليل مباشر للمشاعر",
    pricingFeatureFree4: "حفظ بيانات آخر 7 أيام",
    pricingFeatureFree5: "100 منشور شهرياً",
    pricingFeatureFree6: "سحب تلقائي كل 24 ساعة",
    pricingFeatureFree7: "تحليل مشاعر أساسي",
    pricingFeatureFree8: "آخر 7 أيام فقط",
    pricingFeaturePro1: "حتى 5 صفحات في نفس الوقت",
    pricingFeaturePro2: "تحديث البيانات يومياً",
    pricingFeaturePro3: "فهم مشاعر وتصنيف مواضيع متقدم",
    pricingFeaturePro4: "أرشيف لثلاثة أشهر",
    pricingFeaturePro5: "5,000 منشور شهرياً",
    pricingFeaturePro6: "تقارير احترافية للطباعة",
    pricingFeaturePro7: "تنبيهات عند وجود شكاوى",
    pricingFeatureEnterprise1: "صفحات غير محدودة",
    pricingFeatureEnterprise2: "تحديث مستمر للبيانات",
    pricingFeatureEnterprise3: "تحليل عميق وكشف للأزمات",
    pricingFeatureEnterprise4: "أرشيف دائم",
    pricingFeatureEnterprise5: "منشورات وتعليقات غير محدودة",
    pricingFeatureEnterprise6: "ربط برمجيات شركتك الخاصة",
    pricingFeatureEnterprise7: "دعم فني مباشر وفوري",
    pricingFeatureEnterprise8: "مدير حساب مخصص لخدمتك",

    // Pricing Header Page
    pricingHeaderBadge: "الأسعار والباقات",
    pricingHeaderTitle: "خطة لكل حجم أعمال",
    pricingHeaderDesc: "ابدأ مجاناً وطوّر حسب نمو احتياجاتك. لا عقود ولا التزامات.",

    // CTA
    ctaTitle: "اجعل رضا عملائك أولويتك اللحظية",
    ctaDesc: "لا تدع شكاوى العملاء تضيع وسط الزحام، ولا تغمض عينك عن الإشادات الجميلة. اشترك الآن واجعل الذكاء الاصطناعي موظفاً مخلصاً يقودك للنجاح.",
    ctaBtn: "أنشئ حسابك الجديد الآن",

    // Footer & Disclaimer
    footerDisclaimer: "جميع البيانات مشفرة ومحفوظة بسرية تامة.",

    // Auth
    authTitleLogin: "مرحباً بعودتك",
    authTitleRegister: "إنشاء حساب جديد",
    authSubLogin: "سجّل دخولك للوصول إلى لوحة التحليلات",
    authSubRegister: "ابدأ رحلتك في فهم جمهورك الآن",
    authEmail: "البريد الإلكتروني",
    authPassword: "كلمة المرور",
    authConfirmPassword: "تأكيد كلمة المرور",
    authUsername: "اسم المستخدم",
    authCompanyName: "اسم الشركة",
    authCountry: "الدولة",
    authPhoneNumber: "رقم الهاتف",
    authBtnLogin: "تسجيل الدخول",
    authBtnRegister: "إنشاء الحساب",
    authSwitchToRegister: "ليس لديك حساب؟ سجل الآن",
    authSwitchToLogin: "لديك حساب بالفعل؟ سجل دخولك",
    authSuccessLogin: "تم تسجيل الدخول بنجاح!",
    authSuccessRegister: "تم إنشاء الحساب بنجاح! جاري توجيهك...",
    authError: "حدث خطأ يرجى المحاولة مرة أخرى.",
    authPasswordStrength: "قوة كلمة المرور:",
    authStrengthWeak: "ضعيفة",
    authStrengthMedium: "متوسطة",
    authStrengthStrong: "قوية جداً",
    authCriteriaLength: "8 رموز على الأقل",
    authCriteriaLowercase: "حروف صغيرة (a-z)",
    authCriteriaUppercase: "حروف كبيرة (A-Z)",
    authCriteriaNumber: "أرقام (0-9)",
    authCriteriaSpecial: "رموز خاصة (@، !، $)",
    authCriteriaNoSeq: "أرقام غير متسلسلة عادية",
    authCriteriaError: "يرجى التأكد من استيفاء جميع شروط كلمة المرور المعقدة قبل المتابعة.",
    authLeftHeading1: "حلّل مشاعر جمهورك",
    authLeftHeading2: "واتخذ قرارات أذكى",
    authLeftSub: "اربط صفحاتك على فيسبوك و X واحصل على تحليلات يومية تلقائية للمنشورات والتعليقات.",
    authLeftStat1: "شركة",
    authLeftStat2: "منشور محلّل",
    authLeftStat3: "وقت تشغيل",

    // Dashboard Layout Sidebar
    dbHome: "الرئيسية",
    dbOverview: "نظرة عامة",
    dbPosts: "المنشورات والتعليقات",
    dbSentiment: "تحليل المشاعر",
    dbAccounts: "الحسابات المربوطة",
    dbSystem: "النظام",
    dbPlans: "الاشتراكات والفوترة",
    dbReports: "التقارير",
    dbProfile: "الملف الشخصي",
    dbLogout: "تسجيل خروج",
    dbLoading: "جاري التحميل...",
    dbPlanBasic: "الخطة الأساسية",

    // Dashboard Overview
    ovDesc: "ملخص أداء صفحاتك خلال آخر 30 يوماً",
    ovLastScraped: "مزامنة فورية نشطة (متصل)",
    ovKpiPosts: "إجمالي المنشورات",
    ovKpiComments: "إجمالي التعليقات",
    ovKpiAccounts: "الصفحات المربوطة",
    ovKpiScrapes: "عمليات المزامنة الناجحة",
    ovKpiActive: "نشط",
    ovKpiLastMonth: "آخر 30 يوماً",
    ovKpiWeek: "هذا الأسبوع",
    ovSentPositive: "مشاعر إيجابية",
    ovSentNegative: "مشاعر سلبية",
    ovSentNeutral: "مشاعر محايدة",
    ovChartTitle: "حجم البيانات المزامنة يومياً",
    ovChartSub: "منشورات + تعليقات متزامنة خلال آخر 30 يوماً",
    ovChartPosts: "منشورات",
    ovChartComments: "تعليقات",
    ovDistTitle: "توزيع المنصات",
    ovDistNextScrape: "حالة المزامنة",
    ovDistNextScrapeVal: "مزامنة فورية نشطة (Facebook API)",
    ovTopicsTitle: "أبرز المواضيع المكتشفة",
    ovTopicsMentions: "ذكر",
    ovScrapesTitle: "آخر عمليات المزامنة المباشرة",
    ovScrapesPlatform: "المنصة",
    ovScrapesStatus: "الحالة",
    ovScrapesCount: "سجلات",
    ovScrapesDate: "التاريخ",
    ovScrapesEmpty: "لا يوجد عمليات مزامنة سابقة",
    ovScrapesCompleted: "مكتمل",
    ovError: "حدث خطأ أثناء تحميل البيانات",

    // Connected Accounts
    caTitle: "الحسابات المربوطة",
    caSubtitle: "أضف صفحات فيسبوك لبدء مزامنة البيانات والتعليقات بشكل مباشر وفوري",
    caConnectNew: "ربط حساب جديد",
    caTotalAccounts: "إجمالي الحسابات",
    caActiveAccounts: "حسابات نشطة",
    caPausedAccounts: "حسابات متوقفة",
    caTotalPosts: "إجمالي المنشورات المزامنة",
    caMyAccounts: "🏢 حساباتي",
    caScrapeHistory: "سجل عمليات المزامنة الأخيرة",
    caTableAccount: "الحساب",
    caTablePlatform: "المنصة",
    caTableStatus: "الحالة",
    caTableRecords: "سجلات",
    caTableStartedAt: "بدأ في",
    caTableFinishedAt: "انتهى في",
    caTableDuration: "المدة",
    caJobCompleted: "مكتمل",
    caNoJobs: "لا يوجد عمليات مزامنة سابقة",
    caModalDesc: "قم بربط صفحة الفيسبوك الخاصة بك لمزامنة المنشورات والتعليقات بصورة آمنة وفورية.",
    caConnectFB: "ربط حساب فيسبوك (OAuth رسمي)",
    caCancel: "إلغاء",
    caStatusActive: "نشط",
    caStatusPaused: "متوقف",
    caFollowers: "المتابعون",
    caPosts: "منشورات مزامنة",
    caLastSync: "نوع المزامنة",
    caSyncNow: "مزامنة الآن",
    caSyncing: "جاري المزامنة...",
    caNotStarted: "مباشر ● متصل",
    caNow: "مباشر ● متصل",
    caNotAvailable: "غير متوفر",
    caPlatformFB: "فيسبوك",

    // Plans
    plTitle: "الاشتراكات والفوترة",
    plSubtitle: "قم بترقية خطتك للحصول على ميزات إضافية وتقارير متقدمة.",
    plBasicName: "الخطة الأساسية",
    plBasicPrice: "مجاناً",
    plBasicFeature1: "ربط حساب واحد",
    plBasicFeature2: "مزامنة 100 منشور/يومياً",
    plBasicFeature3: "دعم فني أساسي",
    plProName: "الخطة الاحترافية",
    plProPrice: "$49/شهرياً",
    plProFeature1: "ربط 5 حسابات",
    plProFeature2: "تحليل مشاعر غير محدود",
    plProFeature3: "تقارير متقدمة",
    plProFeature4: "دعم فني 24/7",
    plEntName: "خطة المؤسسات",
    plEntPrice: "$199/شهرياً",
    plEntFeature1: "حسابات غير محدودة",
    plEntFeature2: "تخصيص كامل",
    plEntFeature3: "مدير حساب مخصص",
    plEntFeature4: "API Access",
    plSubscribeNow: "الاشتراك الآن",
    plHistoryTitle: "سجل المدفوعات والاشتراكات",
    plTablePlan: "الخطة المطلوبة",
    plTableAmount: "المبلغ",
    plTableMethod: "طريقة الدفع",
    plTableStatus: "الحالة",
    plTableDate: "التاريخ",
    plStatusApproved: "مقبول",
    plStatusRejected: "مرفوض",
    plStatusPending: "قيد المراجعة",
    plNoPayments: "لا يوجد مدفوعات سابقة",
    plBankTransfer: "حوالة بنكية",
    plModalTitle: "تأكيد الاشتراك: ",
    plModalDesc: "لإتمام عملية الاشتراك، يرجى تحويل المبلغ الموضح إلى الحساب البنكي التالي، ثم إرفاق صورة الإيصال ليتم تفعيل الخطة فوراً بعد المراجعة.",
    plBankLabel: "البنك:",
    plBankVal: "بنك الراجحي",
    plNameLabel: "الاسم:",
    plNameVal: "شركة منصة أناليتيكا",
    plIbanLabel: "الآيبان:",
    plUploadLabel: "إرفاق صورة الإيصال (PNG, JPG)",
    plConfirmBtn: "تأكيد الطلب",
    plSyncing: "جاري الإرسال...",

    // Reports
    repSubtitle: "أنشئ تقارير مفصّلة وتحليلات متقدمة وصدّرها مباشرة بصيغة Excel (XLSX)",
    repGenerateNew: "إنشاء تقرير جديد",
    repModalTitle: "إنشاء تقرير Excel جديد",
    repModalDesc: "اختر نوع التقرير والفترة الزمنية وسيقوم النظام بتصدير البيانات فوراً بصيغة Excel المتوافقة بالكامل مع جداول البيانات.",
    repTypeLabel: "نوع التقرير",
    repType1: "تحليل عام للمشاعر والمواضيع",
    repType2: "تحليل المشاعر المفصل",
    repType3: "تقرير المواضيع والتفاعل",
    repPeriodLabel: "الفترة الزمنية",
    repFrom: "من تاريخ",
    repTo: "إلى تاريخ",
    repTableTitle: "عنوان التقرير",
    repTableType: "النوع",
    repTablePeriod: "الفترة",
    repTableStatus: "الحالة",
    repTableFormat: "الصيغة",
    repTableAction: "الإجراء",
    repEmpty: "لا توجد تقارير سابقة. اضغط على الزر أعلاه لإنشاء أول تقرير Excel.",
    repDownload: "تحميل Excel",
    repGenerating: "جاري إنشاء التقرير...",
  },
  en: {
    // Nav
    navFeatures: "Features",
    navHowItWorks: "How It Works",
    navPricing: "Pricing",
    navLogin: "Login",
    navStartFree: "Start Free",
    navBrand: "Pulse",

    // Hero
    heroBadge: "The New Update for Future of Business",
    heroTitle1: "Read your customers' minds",
    heroTitle2: "with unmatched precision",
    heroDesc: "A smart system that monitors your social media pages 24/7, reads your audience's comments, and immediately informs you of their satisfaction levels to make the right decisions.",
    heroCTA: "Connect your accounts now",
    heroHow: "How we work?",

    // Terminal
    termHeader: "Your smart eye on your customers",
    termInit: "> System initialization for data aggregation... [Success]",
    termAlert: "[Real-time Alert] Aggregating thousands of comments from Facebook & X",
    termCommentTitle: "Latest Comment:",
    termCommentBody: '"My shopping experience with you was amazing, and the product is great!"',
    termAnalysisResult: "Smart Analysis Result:",
    termMood: "Mood: Very Happy 😊",
    termTopic: "Topic: Service Quality",
    termConfidence: "Confidence: 99.2%",
    termWaiting: "> Waiting for more comments...",
    termCard1Title: "Arabic Dialect Parsing Accuracy",
    termCard1Value: "99.8%",
    termCard2Title: "Audited Comments Today",
    termCard2Value: "14,000",

    // Trust Badges
    trustBadge1: "Trust & Safety",
    trustBadge2: "Full Privacy",
    trustBadge3: "Infinite Accuracy",
    trustBadge4: "Smart Investment",
    trustBadge5: "Fast Performance",

    // How It Works
    howTitle1: "Simple Steps, Immediate Results",
    howTitle2: "How Does Our Futuristic System Work?",
    howDesc: "The entire process takes only minutes to get your visual dashboard up and running, allowing you to explore your audience's ideas clearly.",
    step1Title: "Connect your accounts easily",
    step1Desc: "With simple steps and no complexity, connect your business pages on Facebook and your account on X to start the journey of understanding your customers and getting closer to them.",
    step2Title: "Silent monitoring 24/7",
    step2Desc: "Our smart system works silently behind the scenes, continually aggregating and fetching thousands of new comments and posts from your channels.",
    step3Title: "Read & understand customer emotions",
    step3Desc: "AI reads every comment regardless of its dialect, to determine if the customer is happy, angry, or neutral, while understanding the topic they are discussing.",
    step4Title: "Translate data into successful decisions",
    step4Desc: "We compile all these deep analytics and arrange them before you in a single, simple, and clear dashboard, with beautiful visuals to guide your decisions.",

    // Features
    featuresTitle1: "Amazing capabilities for your business",
    featuresTitle2: "The Dashboard Your Business Needs",
    featuresDesc: "A comprehensive suite of tools that makes monitoring your customers easy and enjoyable, helping you continually improve your service quality.",
    feature1Title: "Auto Comment Scraping",
    feature1Desc: "A system that never sleeps, constantly looking for any comment or mention of your company across multiple pages and fetching them cleanly.",
    feature2Title: "Understand Customer Sentiment",
    feature2Desc: "We analyze words and parse local dialects to immediately tell you with high accuracy the percentage of satisfaction, praise, neutral opinions, or frustration.",
    feature3Title: "Discover What Matters to Your Audience",
    feature3Desc: "The system automatically categorizes the most frequent topics (like delivery delays or product quality) so you can intervene in time.",
    feature4Title: "Cross-Platform Comparison",
    feature4Desc: "Clearly see the difference between visitor engagement on Facebook vs platform X to make smarter marketing decisions that optimize your budget.",
    feature5Title: "One-Click Instant Reports",
    feature5Desc: "No need for tedious manual summaries; convert all these figures into beautiful, professional reports to share with your team in one second.",
    feature6Title: "Light & Comfortable Dashboard",
    feature6Desc: "No matter how dazzling the homepage is, we designed a light-themed interface for the dashboard to keep your eyes comfortable during work.",

    // Pricing
    pricingTitle1: "Smart and Reasonable Investment",
    pricingTitle2: "Plans Tailored to Your Growth",
    pricingDesc: "Choose the plan that fits your business now, and enjoy making informed marketing decisions that minimize losses and boost sales.",
    pricingPopular: "Most Popular Plan",
    pricingFreeName: "Free",
    pricingFreePeriod: "Forever",
    pricingFreeDesc: "Perfect for trying the platform before committing",
    pricingProName: "Professional",
    pricingProPeriod: "/ month",
    pricingProDesc: "For startups wanting to understand their audience",
    pricingEnterpriseName: "Enterprise",
    pricingEnterprisePeriod: "/ month",
    pricingEnterpriseDesc: "For large companies managing multiple brands",

    // Pricing Features List
    pricingFeatureFree1: "1 Connected Page (Facebook or X)",
    pricingFeatureFree2: "Daily Data Sync",
    pricingFeatureFree3: "Live Sentiment Analysis",
    pricingFeatureFree4: "Last 7 Days History",
    pricingFeatureFree5: "100 Posts Per Month",
    pricingFeatureFree6: "Auto scraping every 24 hours",
    pricingFeatureFree7: "Basic sentiment analysis",
    pricingFeatureFree8: "Last 7 days history only",
    pricingFeaturePro1: "Up to 5 Pages Simultanously",
    pricingFeaturePro2: "Daily Data Sync",
    pricingFeaturePro3: "Advanced Sentiment & Topic Parsing",
    pricingFeaturePro4: "90 Days Archive",
    pricingFeaturePro5: "5,000 Posts Per Month",
    pricingFeaturePro6: "Printable Professional Reports",
    pricingFeaturePro7: "Negative Sentiment Alerts",
    pricingFeatureEnterprise1: "Unlimited Pages",
    pricingFeatureEnterprise2: "Continuous Data Sync",
    pricingFeatureEnterprise3: "Deep Analytics & Crisis Detection",
    pricingFeatureEnterprise4: "Permanent Archive",
    pricingFeatureEnterprise5: "Unlimited Posts & Comments",
    pricingFeatureEnterprise6: "Custom API Integration",
    pricingFeatureEnterprise7: "24/7 Priority Support",
    pricingFeatureEnterprise8: "Dedicated Account Manager",

    // Pricing Header Page
    pricingHeaderBadge: "Pricing & Plans",
    pricingHeaderTitle: "A Plan for Every Business Size",
    pricingHeaderDesc: "Start free and upgrade as your needs grow. No contracts or commitments.",

    // CTA
    ctaTitle: "Make Customer Satisfaction Your Priority",
    ctaDesc: "Don't let customer complaints get lost in the noise, nor close your eyes to beautiful praise. Register now and let AI be a dedicated employee driving your success.",
    ctaBtn: "Create your new account now",

    // Footer & Disclaimer
    footerDisclaimer: "All data is encrypted and completely private.",

    // Auth
    authTitleLogin: "Welcome Back",
    authTitleRegister: "Create a New Account",
    authSubLogin: "Sign in to access your analytics dashboard",
    authSubRegister: "Start your journey to understand your audience now",
    authEmail: "Email Address",
    authPassword: "Password",
    authConfirmPassword: "Confirm Password",
    authUsername: "Username",
    authCompanyName: "Company Name",
    authCountry: "Country",
    authPhoneNumber: "Phone Number",
    authBtnLogin: "Sign In",
    authBtnRegister: "Sign Up",
    authSwitchToRegister: "Don't have an account? Sign up now",
    authSwitchToLogin: "Already have an account? Sign in",
    authSuccessLogin: "Logged in successfully!",
    authSuccessRegister: "Account created successfully! Redirecting...",
    authError: "Something went wrong, please check your credentials.",
    authPasswordStrength: "Password Strength:",
    authStrengthWeak: "Weak",
    authStrengthMedium: "Medium",
    authStrengthStrong: "Very Strong",
    authCriteriaLength: "At least 8 characters",
    authCriteriaLowercase: "Lowercase letters (a-z)",
    authCriteriaUppercase: "Uppercase letters (A-Z)",
    authCriteriaNumber: "Numbers (0-9)",
    authCriteriaSpecial: "Special characters (@, !, $)",
    authCriteriaNoSeq: "No common number sequences",
    authCriteriaError: "Please make sure to meet all complex password requirements before continuing.",
    authLeftHeading1: "Analyze Your Audience Sentiment",
    authLeftHeading2: "And Make Smarter Decisions",
    authLeftSub: "Connect your pages on Facebook & X and get automatic daily analytics for posts and comments.",
    authLeftStat1: "Companies",
    authLeftStat2: "Posts Analyzed",
    authLeftStat3: "Uptime",

    // Dashboard Layout Sidebar
    dbHome: "Main",
    dbOverview: "Overview",
    dbPosts: "Posts & Comments",
    dbSentiment: "Sentiment Analysis",
    dbAccounts: "Connected Accounts",
    dbSystem: "System",
    dbPlans: "Subscriptions & Billing",
    dbReports: "Reports",
    dbProfile: "User Profile",
    dbLogout: "Sign Out",
    dbLoading: "Loading...",
    dbPlanBasic: "Basic Plan",

    // Dashboard Overview
    ovDesc: "Summary of your pages' performance over the last 30 days",
    ovLastScraped: "Live Sync Active (Connected)",
    ovKpiPosts: "Total Posts",
    ovKpiComments: "Total Comments",
    ovKpiAccounts: "Connected Pages",
    ovKpiScrapes: "Successful Syncs",
    ovKpiActive: "Active",
    ovKpiLastMonth: "Last 30 Days",
    ovKpiWeek: "This Week",
    ovSentPositive: "Positive Sentiment",
    ovSentNegative: "Negative Sentiment",
    ovSentNeutral: "Neutral Sentiment",
    ovChartTitle: "Daily Synchronized Volume",
    ovChartSub: "Synchronized posts + comments in the last 30 days",
    ovChartPosts: "Posts",
    ovChartComments: "Comments",
    ovDistTitle: "Platform Distribution",
    ovDistNextScrape: "Sync Status",
    ovDistNextScrapeVal: "Live sync active (Facebook API)",
    ovTopicsTitle: "Top Discovered Topics",
    ovTopicsMentions: "mentions",
    ovScrapesTitle: "Recent Live Syncs",
    ovScrapesPlatform: "Platform",
    ovScrapesStatus: "Status",
    ovScrapesCount: "Records",
    ovScrapesDate: "Date",
    ovScrapesEmpty: "No previous sync operations found",
    ovScrapesCompleted: "Completed",
    ovError: "An error occurred while loading data",

    // Connected Accounts
    caTitle: "Connected Accounts",
    caSubtitle: "Add Facebook pages to start syncing posts and comments directly and in real-time",
    caConnectNew: "Connect New Account",
    caTotalAccounts: "Total Accounts",
    caActiveAccounts: "Active Accounts",
    caPausedAccounts: "Paused Accounts",
    caTotalPosts: "Total Synced Posts",
    caMyAccounts: "🏢 My Accounts",
    caScrapeHistory: "Recent Sync History",
    caTableAccount: "Account",
    caTablePlatform: "Platform",
    caTableStatus: "Status",
    caTableRecords: "Records",
    caTableStartedAt: "Started At",
    caTableFinishedAt: "Finished At",
    caTableDuration: "Duration",
    caJobCompleted: "Completed",
    caNoJobs: "No previous sync operations found",
    caModalDesc: "Connect your Facebook page to sync posts and comments securely and in real-time.",
    caConnectFB: "Connect Facebook (Official OAuth)",
    caCancel: "Cancel",
    caStatusActive: "Active",
    caStatusPaused: "Paused",
    caFollowers: "Followers",
    caPosts: "Synced Posts",
    caLastSync: "Sync Type",
    caSyncNow: "Sync Now",
    caSyncing: "Syncing...",
    caNotStarted: "Live ● Connected",
    caNow: "Live ● Connected",
    caNotAvailable: "N/A",
    caPlatformFB: "Facebook",

    // Plans
    plTitle: "Subscriptions & Billing",
    plSubtitle: "Upgrade your plan to get extra features and advanced reports.",
    plBasicName: "Basic Plan",
    plBasicPrice: "Free",
    plBasicFeature1: "1 connected page",
    plBasicFeature2: "Sync 100 posts/day",
    plBasicFeature3: "Basic Support",
    plProName: "Professional Plan",
    plProPrice: "$49/month",
    plProFeature1: "Up to 5 connected pages",
    plProFeature2: "Unlimited sentiment analysis",
    plProFeature3: "Advanced Reports",
    plProFeature4: "24/7 Priority Support",
    plEntName: "Enterprise Plan",
    plEntPrice: "$199/month",
    plEntFeature1: "Unlimited connected pages",
    plEntFeature2: "Full Customization",
    plEntFeature3: "Dedicated Account Manager",
    plEntFeature4: "Custom API Access",
    plSubscribeNow: "Subscribe Now",
    plHistoryTitle: "Payment & Subscription History",
    plTablePlan: "Requested Plan",
    plTableAmount: "Amount",
    plTableMethod: "Payment Method",
    plTableStatus: "Status",
    plTableDate: "Date",
    plStatusApproved: "Approved",
    plStatusRejected: "Rejected",
    plStatusPending: "Under Review",
    plNoPayments: "No previous payments found",
    plBankTransfer: "Bank Transfer",
    plModalTitle: "Confirm Subscription: ",
    plModalDesc: "To complete your subscription, please transfer the specified amount to the following bank account, then attach the receipt image to activate your plan immediately after review.",
    plBankLabel: "Bank:",
    plBankVal: "Al Rajhi Bank",
    plNameLabel: "Name:",
    plNameVal: "Analytica Platform Co.",
    plIbanLabel: "IBAN:",
    plUploadLabel: "Attach Receipt Image (PNG, JPG)",
    plConfirmBtn: "Confirm Request",
    plSyncing: "Submitting...",

    // Reports
    repSubtitle: "Generate detailed reports and advanced analytics and export them directly in Excel (XLSX) format",
    repGenerateNew: "Generate New Report",
    repModalTitle: "Generate New Excel Report",
    repModalDesc: "Choose the report type and date range, and the system will immediately export the data in fully compatible Excel spreadsheet format.",
    repTypeLabel: "Report Type",
    repType1: "General Sentiment & Topic Analysis",
    repType2: "Detailed Sentiment Analysis",
    repType3: "Topics & Engagement Report",
    repPeriodLabel: "Date Range",
    repFrom: "From Date",
    repTo: "To Date",
    repTableTitle: "Report Title",
    repTableType: "Type",
    repTablePeriod: "Period",
    repTableStatus: "Status",
    repTableFormat: "Format",
    repTableAction: "Action",
    repEmpty: "No previous reports found. Click the button above to generate your first Excel report.",
    repDownload: "Download Excel",
    repGenerating: "Generating report...",
  }
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ar')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
      document.body.style.direction = 'rtl'
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = 'en'
      document.body.style.direction = 'ltr'
    }

    // Apply global runtime style overrides for dynamic RTL/LTR flipping
    let styleEl = document.getElementById('lang-style-overrides')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'lang-style-overrides'
      document.head.appendChild(styleEl)
    }

    if (lang === 'ar') {
      styleEl.innerHTML = `
        body, h1, h2, h3, h4, .btn { font-family: var(--font-ar) !important; }
        .data-table { text-align: right !important; }
        .sidebar-link.active::before { right: 0 !important; left: auto !important; border-radius: 0 3px 3px 0 !important; }
        .pricing-list { text-align: right !important; }
      `
    } else {
      styleEl.innerHTML = `
        body, h1, h2, h3, h4, .btn { font-family: var(--font-en) !important; }
        .data-table { text-align: left !important; }
        .sidebar-link.active::before { left: 0 !important; right: auto !important; border-radius: 3px 0 0 3px !important; }
        .pricing-list { text-align: left !important; }
      `
    }
  }, [lang])

  const t = (key) => {
    return translations[lang]?.[key] || key
  }

  const toggleLang = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar')
  }

  const isRTL = lang === 'ar'

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
