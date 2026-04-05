import { Link } from 'react-router-dom'

const Dashboard = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F6' }}>
            {/* Sidebar */}
            <aside className="fade-up" style={{ width: '280px', background: 'white', borderLeft: '1px solid var(--border)', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px' }}>
                    <span style={{background: 'var(--text-dark)', color: 'white', padding: '4px 8px', borderRadius: '8px'}}>رأيهم</span>
                </Link>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', paddingRight: '12px' }}>القائمة الرئيسية</div>
                    <a href="#" style={{ padding: '12px 16px', borderRadius: '12px', background: '#F3F4F6', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        📊 ملخص اليوم
                    </a>
                    <a href="#" style={{ padding: '12px 16px', borderRadius: '12px', color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s' }}>
                        🔗 صفحاتي المربوطة
                    </a>
                    <a href="#" style={{ padding: '12px 16px', borderRadius: '12px', color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s' }}>
                        🎯 شو بحكوا عني؟
                    </a>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <Link to="/" style={{ padding: '12px 16px', borderRadius: '12px', color: '#EF4444', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        تسجيل الخروج
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
                <div className="fade-up del-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>ملخص الوضع</h2>
                        <p style={{ color: 'var(--text-light)', fontWeight: 500 }}>آخر تحديث نزل قبل ساعتين، أمورك لوز يا غالي.</p>
                    </div>
                </div>

                {/* Top Metrics Bento */}
                <div className="fade-up del-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
                    <div className="bento-card" style={{ padding: '24px' }}>
                        <div style={{ color: 'var(--text-light)', fontWeight: 600, marginBottom: '16px' }}>كم تعليق سحبنا اليوم؟</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>1,250</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--positive)', fontWeight: 700 }}>+50 استفسار عن اليوم الماضي</div>
                    </div>
                    <div className="bento-card" style={{ padding: '24px' }}>
                        <div style={{ color: 'var(--text-light)', fontWeight: 600, marginBottom: '16px' }}>نسبة المديح إلك</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--positive)', marginBottom: '8px' }}>65%</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>الكل مبسوط من عروض الأسبوع</div>
                    </div>
                    <div className="bento-card" style={{ padding: '24px' }}>
                        <div style={{ color: 'var(--text-light)', fontWeight: 600, marginBottom: '16px' }}>اللي متضايقين منا</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--negative)', marginBottom: '8px' }}>12%</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--negative)', fontWeight: 700 }}>في شوية شكاوي عالشحن اليوم</div>
                    </div>
                </div>

                {/* Big Info Bento */}
                <div className="fade-up del-3" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div className="bento-card" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '32px' }}>معدل التفاعل وشكاوي الزباين (آخر كم يوم)</h3>
                        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                            {/* Simple bars */}
                            {[40, 80, 50, 90, 70, 30].map((h, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', height: '100%' }}>
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', background: '#F3F4F6', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ height: `${h}%`, width: '100%', background: i===4 ? 'var(--negative)' : 'var(--primary)', borderRadius: '8px' }}></div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>يوم {i+1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bento-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>رأيهم فيك بالإجمالي</h3>
                        <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'conic-gradient(var(--positive) 0% 65%, var(--negative) 65% 77%, #E5E7EB 77% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '120px', height: '120px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 800 }}>65%</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', fontSize: '0.9rem', fontWeight: 600 }}>
                            <span style={{color: 'var(--positive)'}}>راضي</span>
                            <span style={{color: 'var(--negative)'}}>زعلان</span>
                            <span style={{color: 'var(--text-light)'}}>عادي</span>
                        </div>
                    </div>
                </div>

                {/* Accounts Bento */}
                <div className="bento-card fade-up del-3" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.3rem' }}>من وين بنسحب؟ (حساباتك)</h3>
                        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ ضيف حساب جديد</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '16px', transition: '0.2s', cursor: 'pointer' }} onMouseOver={(e)=>e.currentTarget.style.borderColor='var(--text-dark)'} onMouseOut={(e)=>e.currentTarget.style.borderColor='var(--border)'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: '#F3F4F6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📘</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>الفيسبوك تبع المحل</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px' }}>سحبنا 850 تعليق اليوم</div>
                                </div>
                            </div>
                            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>متصل وبسحب تمام</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '16px', transition: '0.2s', cursor: 'pointer' }} onMouseOver={(e)=>e.currentTarget.style.borderColor='var(--text-dark)'} onMouseOut={(e)=>e.currentTarget.style.borderColor='var(--border)'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: '#F3F4F6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🐦</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>حساب تويتر الدعم الفني</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px' }}>سحبنا 400 تغريدة اليوم</div>
                                </div>
                            </div>
                            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>متصل وبسحب تمام</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Dashboard
