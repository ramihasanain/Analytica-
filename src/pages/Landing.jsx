import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'مجاني',
    price: '0',
    period: 'للأبد',
    desc: 'مثالي لتجربة المنصة قبل الالتزام',
    featured: false,
    features: [
      'صفحة واحدة (فيسبوك أو X)',
      'تحديث البيانات يومياً',
      'تحليل مباشر للمشاعر',
      'حفظ بيانات آخر 7 أيام',
      '100 منشور شهرياً',
    ],
    cta: 'ابدأ مجاناً',
    color: '#38BDF8'
  },
  {
    name: 'احترافي',
    price: '49',
    period: '/ شهرياً',
    desc: 'للشركات الناشئة التي تريد فهم جمهورها بوضوح',
    featured: true,
    features: [
      'حتى 5 صفحات في نفس الوقت',
      'تحديث البيانات يومياً',
      'فهم مشاعر وتصنيف مواضيع متقدم',
      'أرشيف لثلاثة أشهر',
      '5,000 منشور شهرياً',
      'تقارير احترافية للطباعة',
      'تنبيهات عند وجود شكاوى',
    ],
    cta: 'اختر الخطة الاحترافية',
    color: '#A855F7'
  },
  {
    name: 'مؤسسات',
    price: '199',
    period: '/ شهرياً',
    desc: 'للشركات الكبيرة التي تدير عدة علامات تجارية',
    featured: false,
    features: [
      'صفحات غير محدودة',
      'تحديث مستمر للبيانات',
      'تحليل عميق وكشف للأزمات',
      'أرشيف دائم',
      'منشورات وتعليقات غير محدودة',
      'ربط برمجيات شركتك الخاصة',
      'دعم فني مباشر وفوري',
      'مدير حساب مخصص لخدمتك',
    ],
    cta: 'تواصل مع المبيعات',
    color: '#EC4899'
  },
]

const Landing = () => {
  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: '#fff', overflow: 'hidden', fontFamily: 'var(--font-ar)' }}>
      {/* Scoped CSS for the crazy animations */}
      <style>{`
        .cosmos-bg {
          position: fixed; inset: 0; z-index: 0;
          background: #030712;
          background-image: 
            radial-gradient(circle at 15% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
          background-position: 0 0, 0 0, center center, center center;
          animation: bgDrift 60s linear infinite;
        }
        @keyframes bgDrift {
          0% { background-position: 0 0, 0 0, 0 0, 0 0; }
          100% { background-position: 0 0, 0 0, -40px -40px, -40px -40px; }
        }

        .hero-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 80vw; height: 80vw; max-width: 800px; max-height: 800px;
          background: conic-gradient(from 0deg at 50% 50%, rgba(56, 189, 248, 0.1) 0deg, rgba(168, 85, 247, 0.1) 120deg, rgba(236, 72, 153, 0.1) 240deg, rgba(56, 189, 248, 0.1) 360deg);
          filter: blur(80px);
          border-radius: 50%;
          animation: spinGlow 15s linear infinite;
          z-index: 0;
        }
        @keyframes spinGlow { 100% { transform: translate(-50%, -50%) rotate(360deg); } }

        .text-gradient-ai {
          background: linear-gradient(to right, #38BDF8, #A855F7, #EC4899);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShine 4s linear infinite;
        }
        @keyframes textShine { to { background-position: 200% center; } }

        .ai-card {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .ai-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0; transition: opacity 0.4s;
        }
        .ai-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(56,189,248,0.1);
        }
        .ai-card:hover::before { opacity: 1; }

        .btn-ai {
          background: transparent; color: #fff;
          border: 1px solid rgba(56,189,248,0.4);
          box-shadow: 0 0 15px rgba(56,189,248,0.1) inset, 0 0 15px rgba(56,189,248,0.2);
          position: relative; overflow: hidden;
          transition: all 0.3s;
        }
        .btn-ai::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .btn-ai:hover {
          background: rgba(56,189,248,0.1);
          box-shadow: 0 0 25px rgba(56,189,248,0.3) inset, 0 0 30px rgba(56,189,248,0.4);
        }
        .btn-ai:hover::before { left: 100%; }

        .typing-effect {
          width: 0; overflow: hidden; white-space: nowrap; border-right: 2px solid #38BDF8;
          animation: typing 3.5s steps(40, end) forwards, blink .75s step-end infinite;
        }
        @keyframes typing { from { width: 0 } to { width: 100% } }
        @keyframes blink { from, to { border-color: transparent } 50% { border-color: #38BDF8; } }
        
        .floating { animation: floatingAnim 6s ease-in-out infinite; }
        @keyframes floatingAnim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .pulse-ring {
          position: absolute; width: 100%; height: 100%; border-radius: 50%;
          border: 1px solid rgba(56,189,248,0.5);
          animation: pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .gradient-border-card {
          position: relative;
          background: rgba(3, 7, 18, 0.9);
          border-radius: 20px;
          z-index: 1;
        }
        .gradient-border-card::before {
          content: ""; position: absolute; z-index: -1; inset: -2px;
          background: linear-gradient(135deg, rgba(56,189,248,0.5), rgba(168,85,247,0.5), rgba(236,72,153,0.5));
          border-radius: 22px; transition: opacity 0.3s;
          opacity: 0.5;
        }
        .gradient-border-card:hover::before { opacity: 1; }
      `}</style>

      {/* Background Matrix */}
      <div className="cosmos-bg"></div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container-lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Analytica Logo" style={{ height: '40px', borderRadius: '8px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.95rem', fontWeight: 600, transition: '0.2s', letterSpacing: '0.5px' }} onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.6)'}>المزايا العصرية</a>
            <a href="#how" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.95rem', fontWeight: 600, transition: '0.2s', letterSpacing: '0.5px' }} onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.6)'}>آلية العمل ببساطة</a>
            <a href="#pricing" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.95rem', fontWeight: 600, transition: '0.2s', letterSpacing: '0.5px' }} onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.6)'}>خطط الأسعار</a>
            <Link to="/auth" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.95rem', fontWeight: 600, transition: '0.2s' }} onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.6)'}>تسجيل الدخول</Link>
            <Link to="/auth" className="btn btn-ai" style={{ padding: '12px 28px', fontSize: '.95rem', borderRadius: '100px', fontWeight: 700 }}>ابدأ مجاناً</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', zIndex: 1 }}>
        <div className="hero-glow"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            {/* Right: Text Content */}
            <div className="animate-fade-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '100px', marginBottom: '32px' }}>
                <span style={{ width: '8px', height: '8px', background: '#38BDF8', borderRadius: '50%', boxShadow: '0 0 8px #38BDF8' }}></span>
                <span className="mono" style={{ fontSize: '.85rem', color: '#38BDF8', fontWeight: 700, letterSpacing: '1px' }}>التحديث الجديد لمستقبل الأعمال</span>
              </div>
              
              <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#fff', fontWeight: 900, lineHeight: 1.4, marginBottom: '24px' }}>
                اقرأ أفكار عملائك <br/>
                <span className="text-gradient-ai">بدقّة لا تُضاهى</span>
              </h1>
              
              <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '500px' }}>
                نظام ذكي يراقب صفحاتك على السوشيال ميديا على مدار الساعة، يقرأ تعليقات جمهورك، ويخبرك فوراً بمدى رضاهم عن خدماتك لتتخذ القرار الصحيح.
              </p>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/auth" className="btn btn-ai" style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: '100px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  اربط حساباتك الآن
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
                <a href="#how" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  كيف نعمل؟
                </a>
              </div>
            </div>

            {/* Left: 3D Holographic Terminal Demo */}
            <div className="floating" style={{ position: 'relative', perspective: '1000px' }}>
              <svg style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120%', height: '120%', zIndex: 0, opacity: 0.3 }} viewBox="0 0 100 100">
                <circle cx="20" cy="20" r="1.5" fill="#38BDF8"/>
                <circle cx="80" cy="50" r="1" fill="#A855F7"/>
                <circle cx="40" cy="80" r="2" fill="#EC4899"/>
                <line x1="20" y1="20" x2="80" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                <line x1="80" y1="50" x2="40" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                <line x1="40" y1="80" x2="20" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              </svg>

              <div style={{ transform: 'rotateY(-15deg) rotateX(10deg)', transformStyle: 'preserve-3d' }}>
                <div style={{ background: 'rgba(3, 7, 18, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', backdropFilter: 'blur(20px)', boxShadow: '0 0 40px rgba(56, 189, 248, 0.1)', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
                    <span className="mono" style={{ fontSize: '.8rem', color: 'rgba(255,255,255,0.4)', marginLeft: '12px' }}>عينك الذكية على عملائك</span>
                  </div>
                  <div style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="mono" style={{ color: '#34D399', fontSize: '.85rem' }}>&gt; تجهيز النظام لجمع البيانات... [نجاح]</div>
                    <div className="mono" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.85rem', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#38BDF8' }}>[تنبيه مباشر]</span> سحب آلاف التعليقات من فيسبوك و X
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '16px', borderLeft: '2px solid #A855F7', marginTop: '8px' }}>
                      <div className="mono typing-effect" style={{ color: '#E2E8F0', fontSize: '.8rem', lineHeight: 1.6 }}>
                        التعليق الأحدث:<br/>
                        &nbsp;&nbsp;"تجربة الشراء منكم كانت مذهلة والمنتج رائع!"<br/><br/>
                        نتيجة التحليل الذكي:<br/>
                        &nbsp;&nbsp;المزاج: سعيد جداً 😊<br/>
                        &nbsp;&nbsp;الموضوع: جودة الخدمة<br/>
                        &nbsp;&nbsp;مدى اليقين: 99.2%
                      </div>
                    </div>
                    <div className="mono" style={{ color: '#FCD34D', fontSize: '.85rem', marginTop: 'auto' }}>&gt; جاري انتظار تعليقات أخرى...</div>
                  </div>
                </div>

                <div style={{ position: 'absolute', top: '-20px', right: '-40px', background: 'rgba(3,7,18,0.9)', border: '1px solid #38BDF8', padding: '16px', borderRadius: '16px', backdropFilter: 'blur(10px)', transform: 'translateZ(50px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ fontSize: '.75rem', color: '#38BDF8', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>دقة فهم اللهجات العربية</div>
                  <div className="mono" style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 900 }}>99.8%</div>
                </div>

                <div style={{ position: 'absolute', bottom: '40px', left: '-50px', background: 'rgba(3,7,18,0.9)', border: '1px solid #A855F7', padding: '16px', borderRadius: '16px', backdropFilter: 'blur(10px)', transform: 'translateZ(80px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ fontSize: '.75rem', color: '#A855F7', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>التعليقات المفحوصة اليوم</div>
                  <div className="mono" style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 900 }}>14 ألف</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HORIZONTAL LOGO TICKER */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '24px 0', background: 'rgba(0,0,0,0.3)', position: 'relative', zIndex: 5 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '60px', opacity: 0.4, filter: 'grayscale(100%) contrast(200%)' }}>
          {/* Trust badges instead of complex names */}
          {['ثقة وآمان', 'خصوصية تامة', 'دقة لا متناهية', 'استثمار ذكي', 'سرعة الأداء'].map((x, i) => (
            <span key={i} className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1px' }}>{x}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '140px 0', position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span style={{ color: '#38BDF8', fontSize: '.9rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>خطوات بسيطة ونتيجة فورية</span>
            <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '24px' }}>كيف يعمل نظامنا المستقبلي؟</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', maxWidth: '600px', marginInline: 'auto' }}>
              العملية كاملة لا تستغرق سوى دقائق لتكون لوحة القيادة البصرية بين يديك لتستكشف أفكار جمهورك بوضوح تام.
            </p>
          </div>

          <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'linear-gradient(to bottom, #38BDF8, #A855F7, #EC4899)' }}></div>
            
            {[
              { title: 'ربط حساباتك بسهولة', desc: 'بخطوات بسيطة وبدون أي تعقيد، قم بربط صفحاتك التجارية على فيسبوك وحسابك على X لتبدأ رحلة فهم عملائك والاقتراب منهم أكثر.', side: 'right', color: '#38BDF8' },
              { title: 'مراقبة هادئة على مدار الساعة', desc: 'يعمل نظامنا الذكي بصمت خلف الكواليس، حيث يقوم بجمع وسحب آلاف التعليقات والمنشورات الجديدة من قنواتك باستمرار.', side: 'left', color: '#A855F7' },
              { title: 'قراءة وفهم مشاعر العملاء', desc: 'يقوم الذكاء الاصطناعي بقراءة كل تعليق مهما كانت لهجته، لتحديد ما إذا كان العميل سعيداً، غاضباً، أو محايداً، مع فهم الموضوع الذي يتحدث عنه.', side: 'right', color: '#EC4899' },
              { title: 'تحويل البيانات إلى قرارات ناجحة', desc: 'نجمع كل هذه التحليلات العميقة ونرتبها أمامك في لوحة تحكم واحدة، بسيطة وواضحة جداً وبألوان ورسوم جذابة ترشدك لاتخاذ القرار الصحيح.', side: 'left', color: '#38BDF8' }
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: step.side === 'left' ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: '60px', position: 'relative' }}>
                <div style={{ flex: 1, textAlign: step.side === 'left' ? 'left' : 'right', padding: step.side === 'left' ? '0 40px 0 0' : '0 0 0 40px' }}>
                  <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexDirection: step.side === 'left' ? 'row-reverse' : 'row' }}>
                    {step.title}
                    <span className="mono" style={{ color: step.color, fontSize: '1rem', background: `${step.color}20`, padding: '4px 12px', borderRadius: '100px' }}>الخطوة 0{i+1}</span>
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.8 }}>{step.desc}</p>
                </div>
                
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#030712', border: `4px solid ${step.color}`, position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2, boxShadow: `0 0 20px ${step.color}` }}></div>
                
                <div style={{ flex: 1 }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMMERSIVE FEATURES (GRID) */}
      <section id="features" style={{ padding: '140px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span style={{ color: '#A855F7', fontSize: '.9rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>إمكانيات مدهشة لعملك</span>
            <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '24px' }}>لوحة التحكم التي تحتاجها شركتك</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', maxWidth: '600px', marginInline: 'auto' }}>
              مجموعة متكاملة من الأدوات التي تجعل متابعة عملائك سهلة وممتعة، وتساعدك على تحسين جودة خدماتك باستمرار.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {[
              {
                title: 'سحب التعليقات تلقائياً',
                desc: 'نظام لا ينام أبداً، يبحث باستمرار عن أي تعليق أو ذكر لشركتك على صفحاتك المتعددة ويجلبها لك بترتيب ووضوح.',
                icon: <svg width="28" height="28" fill="none" stroke="#38BDF8" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>,
                color: '#38BDF8'
              },
              {
                title: 'فهم حالة العميل المزاجية',
                desc: 'نحلل الكلمات ونفهم اللهجات الدارجة لنخبرك فوراً وبدقة ممتازة عن نسبة الرضا، الثناء، المنشورات المحايدة، أو الانزعاج والغضب.',
                icon: <svg width="28" height="28" fill="none" stroke="#A855F7" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
                color: '#A855F7'
              },
              {
                title: 'اكتشاف ما يهم جمهورك',
                desc: 'يصنّف لك النظام من تلقاء نفسه أكثر المواضيع تكراراً (مثل التأخير في التوصيل أو جودة المنتجات) لتتدخل في الوقت المناسب.',
                icon: <svg width="28" height="28" fill="none" stroke="#EC4899" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M9 12h6"/></svg>,
                color: '#EC4899'
              },
              {
                title: 'مقارنة المنصات المختلفة',
                desc: 'شاهد بوضوح وسهولة الفرق بين تفاعل زوارك على فيسبوك وتفاعلهم على منصة X لتتخذ قرارات تسويقية أذكى توفر ميزانيتك.',
                icon: <svg width="28" height="28" fill="none" stroke="#10B981" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>,
                color: '#10B981'
              },
              {
                title: 'تقارير جاهزة بنقرة واحدة',
                desc: 'لا حاجة للتلخيص اليدوي المزعج، حوّل كل هذه الأرقام إلى تقارير PDF جميلة واحترافية لمشاركتها مع الموظفين بثانية واحدة.',
                icon: <svg width="28" height="28" fill="none" stroke="#F59E0B" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>,
                color: '#F59E0B'
              },
              {
                title: 'لوحة تحكم خفيفة ومريحة',
                desc: 'مهما كانت الشاشة الأمامية مبهرة، صممنا لك نظاماً داخلياً باللون الفاتح والمريح للعين، تقضي فيه وقت العمل بدون إرهاق.',
                icon: <svg width="28" height="28" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
                color: '#6366F1'
              }
            ].map((f, i) => (
               <div key={i} className="ai-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `rgba(255,255,255,0.03)`, border: `1px solid ${f.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: `0 0 20px ${f.color}20` }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px' }}>{f.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANCED PRICING */}
      <section id="pricing" style={{ padding: '140px 0', position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.01)' }}>
         <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span style={{ color: '#38BDF8', fontSize: '.9rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>الاستثمار الذكي المعقول</span>
            <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '24px' }}>باقات مصممة لنمو أعمالك</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', maxWidth: '600px', marginInline: 'auto' }}>
              اختر الخطة التي تناسب نشاطك التجاري الآن، واستمتع بصناعة قرارات تسويقية صائبة تقلل الخسائر وترفع المبيعات بشكل ملحوظ.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', maxWidth: '1100px', margin: '0 auto' }}>
            {plans.map((plan, i) => (
              <div key={i} className={plan.featured ? "gradient-border-card" : "ai-card"} style={{ padding: '40px', display: 'flex', flexDirection: 'column', background: plan.featured ? 'rgba(3, 7, 18, 0.95)' : undefined }}>
                {plan.featured && (
                  <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'linear-gradient(90deg, #A855F7, #EC4899)', color: '#fff', padding: '6px 20px', borderRadius: '100px', fontSize: '.85rem', fontWeight: 800, letterSpacing: '1px' }}>الباقة الأكثر اقتناءً</span>
                )}
                
                <h3 style={{ fontSize: '1.6rem', color: plan.color, marginBottom: '8px' }}>{plan.name}</h3>
                <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>{plan.desc}</p>
                
                <div style={{ marginBottom: '40px' }}>
                  <span className="mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff' }}>${plan.price}</span>
                  <span style={{ fontSize: '.9rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}> {plan.period}</span>
                </div>
                
                <ul style={{ listStyle: 'none', textAlign: 'right', flex: 1, marginBottom: '40px' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                      <svg width="20" height="20" fill="none" stroke={plan.color} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                
                <Link to="/auth" className="btn btn-ai" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', textAlign: 'center', borderColor: plan.color, boxShadow: plan.featured ? `0 0 20px ${plan.color}40 inset` : undefined }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
         </div>
      </section>

      {/* IMMERSIVE CTA */}
      <section style={{ padding: '80px 0 120px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(180deg, rgba(3,7,18,0) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '32px', padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% -20%, rgba(168,85,247,0.3), transparent 60%)' }}></div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '24px' }}>اجعل رضا عملائك أولويتك اللحظية</h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', marginInline: 'auto', marginBottom: '40px' }}>
                لا تدع شكاوى العملاء تضيع وسط الزحام، ولا تغمض عينك عن الإشادات الجميلة. اشترك الآن واجعل الذكاء الاصطناعي موظفاً مخلصاً يقودك للنجاح.
              </p>
              <Link to="/auth" className="btn btn-ai" style={{ padding: '20px 48px', fontSize: '1.2rem', borderRadius: '100px', fontWeight: 800 }}>
                أنشئ حسابك الجديد الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 0', position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.5)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Analytica Logo" style={{ height: '32px', borderRadius: '6px', objectFit: 'contain' }} />
          </div>
          <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,0.4)' }}>
            جميع البيانات مشفرة ومحفوظة بسرية تامة.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
