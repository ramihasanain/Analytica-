import { useState, useEffect } from 'react'
import api from '../../services/api'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts'

const SentimentAnalytics = () => {
  const [allData, setAllData] = useState([]) // Both posts and comments
  const [profiles, setProfiles] = useState([])
  const [topics, setTopics] = useState(['الكل'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Interactive filtering states
  const [selectedProfile, setSelectedProfile] = useState('all')
  const [selectedTopic, setSelectedTopic] = useState('الكل')
  const [selectedType, setSelectedType] = useState('all') // 'all', 'post', 'comment'
  const [selectedSentiment, setSelectedSentiment] = useState('all') // 'all', 'إيجابي', 'سلبي', 'محايد'
  const [timeRange, setTimeRange] = useState('all') // 'all', '7d', '30d'
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, profilesRes, topicsRes] = await Promise.all([
          api.get('/posts/'),
          api.get('/profiles/'),
          api.get('/posts/topics/')
        ])

        // Only keep Facebook data
        const fbProfiles = profilesRes.data.filter(prof => prof.platform === 'facebook')
        setProfiles(fbProfiles)

        const fbAllData = postsRes.data.filter(p => p.platform === 'facebook')
        
        // Map raw data and parse dates for time range calculations
        const mappedData = fbAllData.map(p => {
          const rawDate = p.posted_at ? new Date(p.posted_at) : new Date()
          const dateStr = rawDate.toISOString().split('T')[0]
          const labelDate = rawDate.toLocaleString('ar-EG', { month: 'short', day: 'numeric' })
          return {
            id: p.id,
            profile_id: p.profile,
            platform: p.platform || 'facebook',
            content: p.content,
            raw_date: rawDate,
            dateStr: dateStr,
            labelDate: labelDate,
            sentiment: p.sentiment || 'محايد',
            score: p.score || 0.5,
            type: p.media_type || 'post',
            topic: p.topic || 'غير محدد',
            engine_used: p.engine_used || 'Local Lexicon',
            is_sarcastic: p.is_sarcastic || false,
            sarcasm_explanation: p.sarcasm_explanation || '',
            is_analyzed: p.is_analyzed || false
          }
        })

        setAllData(mappedData)
        setTopics(['الكل', ...topicsRes.data])
      } catch (err) {
        console.error('Error fetching analytics data:', err)
        setError('تعذر تحميل بيانات التحليلات.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>جاري معالجة وتحليل توجهات المشاعر... 🧠</div>
  if (error) return <div style={{ padding: '40px', background: 'var(--red-light)', color: 'var(--red)', borderRadius: '12px', margin: '20px 0' }}>{error}</div>

  // Reactive filtering logic
  const filteredData = allData.filter(item => {
    if (selectedProfile !== 'all' && item.profile_id !== parseInt(selectedProfile)) return false
    if (selectedTopic !== 'الكل' && item.topic !== selectedTopic) return false
    if (selectedType !== 'all' && item.type !== selectedType) return false
    if (selectedSentiment !== 'all' && item.sentiment !== selectedSentiment) return false
    if (searchQuery.trim() && !item.content.toLowerCase().includes(searchQuery.toLowerCase())) return false

    if (timeRange !== 'all') {
      const now = new Date()
      const diffTime = Math.abs(now - item.raw_date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (timeRange === '7d' && diffDays > 7) return false
      if (timeRange === '30d' && diffDays > 30) return false
    }
    return true
  })

  // Dynamic Metrics Calculations
  const total = filteredData.length
  const positive = filteredData.filter(i => i.sentiment === 'إيجابي').length
  const negative = filteredData.filter(i => i.sentiment === 'سلبي').length
  const neutral = filteredData.filter(i => i.sentiment === 'محايد').length
  
  const posPct = total > 0 ? Math.round((positive / total) * 100) : 0
  const negPct = total > 0 ? Math.round((negative / total) * 100) : 0
  const neuPct = total > 0 ? Math.round((neutral / total) * 100) : 0
  
  const csatScore = total > 0 ? (((positive * 10) + (neutral * 5)) / total).toFixed(1) : '0.0'
  const sarcasticCount = filteredData.filter(i => i.is_sarcastic).length
  const sarcasmRate = total > 0 ? ((sarcasticCount / total) * 100).toFixed(1) : '0.0'

  // Advanced Professional KPIs
  const npsScore = posPct - negPct
  const avgConfidence = total > 0 ? Math.round((filteredData.reduce((acc, curr) => acc + curr.score, 0) / total) * 100) : 0
  
  const postsCount = filteredData.filter(i => i.type === 'post').length
  const commentsCount = filteredData.filter(i => i.type === 'comment').length
  const commentsRatio = postsCount > 0 ? (commentsCount / postsCount).toFixed(1) : '0.0'

  // Recharts Data mapping
  const pieData = [
    { name: 'إيجابي', value: positive, color: '#10b981' },
    { name: 'سلبي', value: negative, color: '#ef4444' },
    { name: 'محايد', value: neutral, color: '#f59e0b' }
  ].filter(item => item.value > 0)

  // Timeline Grouper
  const groupTimeline = () => {
    const groups = {}
    filteredData.forEach(item => {
      const key = item.labelDate
      if (!groups[key]) {
        groups[key] = { date: key, raw_date: item.raw_date, 'إيجابي': 0, 'سلبي': 0, 'محايد': 0 }
      }
      groups[key][item.sentiment]++
    })
    return Object.values(groups)
      .sort((a, b) => a.raw_date - b.raw_date)
      .slice(-15) // Show last 15 active days for readability
  }
  const timelineData = groupTimeline()

  // Topic Grouper
  const groupTopics = () => {
    const groups = {}
    filteredData.forEach(item => {
      const key = item.topic
      if (!groups[key]) {
        groups[key] = { topic: key, 'إيجابي': 0, 'سلبي': 0, 'محايد': 0, total: 0 }
      }
      groups[key][item.sentiment]++
      groups[key].total++
    })
    return Object.values(groups)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5) // Top 5 topics
  }
  const topicData = groupTopics()

  return (
    <div>
      <style>{`
        .analytics-card {
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 22px;
          color: var(--text-primary);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .analytics-card:hover {
          transform: translateY(-4px);
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.06);
        }
        .glow-pos:hover {
          border-color: rgba(16, 185, 129, 0.3);
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.08);
        }
        .glow-neg:hover {
          border-color: rgba(239, 68, 68, 0.3);
          box-shadow: 0 12px 30px rgba(239, 68, 68, 0.08);
        }
        .glow-neu:hover {
          border-color: rgba(245, 158, 11, 0.3);
          box-shadow: 0 12px 30px rgba(245, 158, 11, 0.08);
        }
        .filter-btn {
          padding: 8px 16px;
          font-size: .83rem;
          font-weight: 600;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }
        .filter-btn.active {
          background: var(--blue);
          color: #fff;
          border-color: var(--blue);
          box-shadow: 0 0 12px rgba(37, 99, 235, 0.2);
        }
        .search-input {
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          border-radius: 8px;
          padding: 10px 16px;
          outline: none;
          font-family: var(--font-ar);
          font-size: .88rem;
          width: 100%;
          transition: all 0.2s;
        }
        .search-input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.15);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>لوحة تحليل المشاعر التفاعلية</h1>
          <p style={{ fontSize: '.92rem' }}>تقرير عاطفي عميق ومحدث بالخلفية لـ {allData.length} منشوراً وتعليقاً مسحوباً.</p>
        </div>
        
        {/* Time Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-elevated)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          {[
            { key: 'all', label: 'كل المدة' },
            { key: '30d', label: 'آخر 30 يوم' },
            { key: '7d', label: 'آخر 7 أيام' }
          ].map(t => (
            <button 
              key={t.key} 
              className={`filter-btn ${timeRange === t.key ? 'active' : ''}`} 
              onClick={() => setTimeRange(t.key)}
              style={{ padding: '6px 14px', fontSize: '.8rem' }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr', gap: '16px', alignItems: 'center' }}>
        
        {/* Profile filter */}
        <div>
          <label style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>🏢 الصفحة المربوطة</label>
          <select 
            value={selectedProfile} 
            onChange={e => setSelectedProfile(e.target.value)} 
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '.82rem', fontWeight: 600, outline: 'none' }}
          >
            <option value="all">كل الصفحات</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.account_name}</option>)}
          </select>
        </div>

        {/* Topic filter */}
        <div>
          <label style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>📌 الموضوع المكتشف</label>
          <select 
            value={selectedTopic} 
            onChange={e => setSelectedTopic(e.target.value)} 
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '.82rem', fontWeight: 600, outline: 'none' }}
          >
            {topics.map(t => <option key={t} value={t}>{t === 'الكل' ? 'كل المواضيع' : t}</option>)}
          </select>
        </div>

        {/* Media type filter */}
        <div>
          <label style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>📂 تصنيف النص</label>
          <select 
            value={selectedType} 
            onChange={e => setSelectedType(e.target.value)} 
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '.82rem', fontWeight: 600, outline: 'none' }}
          >
            <option value="all">المنشورات والتعليقات</option>
            <option value="post">المنشورات فقط 📄</option>
            <option value="comment">التعليقات فقط 💬</option>
          </select>
        </div>

        {/* Search query input */}
        <div>
          <label style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>🔍 بحث بالكلمة المفتاحية</label>
          <input 
            type="text" 
            className="search-input" 
            placeholder="مثال: رائع، بطيء، التوصيل..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Texts Analyzed */}
        <div className="analytics-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>إجمالي النصوص</span>
            <span style={{ fontSize: '1.3rem' }}>📝</span>
          </div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>{total.toLocaleString()}</div>
          <span className="badge badge-blue" style={{ fontSize: '.7rem' }}>بيانات فيسبوك مفلترة</span>
        </div>

        {/* CSAT Rating */}
        <div className="analytics-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>مؤشر الرضا العام</span>
            <span style={{ fontSize: '1.3rem' }}>⭐</span>
          </div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', marginBottom: '6px' }}>{csatScore}/10</div>
          <span className="badge badge-green" style={{ fontSize: '.7rem' }}>صيغة CSAT الموزونة</span>
        </div>

        {/* Net Promoter Score (NPS) */}
        <div className="analytics-card" style={{ borderLeft: '3px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>صافي الترويج (NPS)</span>
            <span style={{ fontSize: '1.3rem' }}>📊</span>
          </div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: npsScore > 0 ? '#10b981' : npsScore < 0 ? '#ef4444' : '#f59e0b', marginBottom: '6px' }}>
            {npsScore > 0 ? '+' : ''}{npsScore}%
          </div>
          <span className={`badge ${npsScore > 0 ? 'badge-green' : npsScore < 0 ? 'badge-red' : 'badge-gray'}`} style={{ fontSize: '.7rem' }}>صافي التقييم العاطفي</span>
        </div>

        {/* Avg Confidence */}
        <div className="analytics-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ثقة ودقة التحليل</span>
            <span style={{ fontSize: '1.3rem' }}>🎯</span>
          </div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4f46e5', marginBottom: '6px' }}>{avgConfidence}%</div>
          <span className="badge badge-blue" style={{ fontSize: '.7rem' }}>دقة المحرك الهجين</span>
        </div>

        {/* Positive sentiment */}
        <div className="analytics-card glow-pos">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '.82rem', color: '#10b981', fontWeight: 600 }}>نصوص إيجابية</span>
            <span style={{ fontSize: '1.3rem' }}>😊</span>
          </div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>{posPct}%</div>
          <span style={{ fontSize: '.72rem', color: 'var(--text-secondary)' }}>{positive} منشور وتعليق</span>
        </div>

        {/* Negative sentiment */}
        <div className="analytics-card glow-neg">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '.82rem', color: '#ef4444', fontWeight: 600 }}>نصوص سلبية</span>
            <span style={{ fontSize: '1.3rem' }}>😠</span>
          </div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', marginBottom: '6px' }}>{negPct}%</div>
          <span style={{ fontSize: '.72rem', color: 'var(--text-secondary)' }}>{negative} منشور وتعليق</span>
        </div>

        {/* Sarcasm flag */}
        <div className="analytics-card" style={{ borderLeft: '3px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '.82rem', color: '#8b5cf6', fontWeight: 600 }}>التهكم والسخرية</span>
            <span style={{ fontSize: '1.3rem' }}>⚠️</span>
          </div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '6px' }}>{sarcasticCount} <span style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>({sarcasmRate}%)</span></div>
          <span className="badge" style={{ fontSize: '.7rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--violet)' }}>مرصودة بـ Gemini 🧠</span>
        </div>

        {/* Engagement Density */}
        <div className="analytics-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>كثافة تفاعل الجمهور</span>
            <span style={{ fontSize: '1.3rem' }}>💬</span>
          </div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blue)', marginBottom: '6px' }}>{commentsRatio} <span style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>تعليق/منشور</span></div>
          <span className="badge badge-gray" style={{ fontSize: '.7rem' }}>بناءً على {postsCount} منشوراً و {commentsCount} تعليقاً</span>
        </div>

      </div>

      {/* Main Interactive Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Trend Area Chart */}
        <div className="analytics-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>📈 التطور الزمني للمشاعر المسحوبة</h3>
          <div style={{ height: '260px', width: '100%' }}>
            {timelineData.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>لا يوجد سجل زمني مطابق للفلاتر الحالية</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: '10px' }} />
                  <Area type="monotone" dataKey="إيجابي" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPos)" />
                  <Area type="monotone" dataKey="سلبي" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorNeg)" />
                  <Area type="monotone" dataKey="محايد" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Sentiment Donut Chart */}
        <div className="analytics-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', alignSelf: 'flex-start', color: 'var(--text-primary)' }}>🍩 توزيع النسب المئوية</h3>
          <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {total === 0 ? (
              <div style={{ color: '#64748b', fontSize: '.8rem' }}>فارغ</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '.8rem' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>{total}</span>
              <span style={{ fontSize: '.7rem', color: 'var(--text-secondary)' }}>سجل عاطفي</span>
            </div>
          </div>
          
          {/* Small Legend below Donut */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'إيجابي', color: '#10b981', pct: `${posPct}%` },
              { label: 'سلبي', color: '#ef4444', pct: `${negPct}%` },
              { label: 'محايد', color: '#f59e0b', pct: `${neuPct}%` }
            ].map((lg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.78rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: lg.color }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>{lg.label} ({lg.pct})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Middle row: Topics breakdown stacked chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Dynamic Topic Bar Chart */}
        <div className="analytics-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>📊 توزيع المشاعر حسب المواضيع الخمسة الأبرز</h3>
          <div style={{ height: '240px', width: '100%' }}>
            {topicData.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>لا يوجد تصنيف مواضيع مطابق</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="topic" type="category" tick={{ fill: 'var(--text-primary)', fontSize: 9.5, fontWeight: 600, textAnchor: 'end' }} axisLine={false} tickLine={false} width={150} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Bar dataKey="إيجابي" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="سلبي" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="محايد" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Live dynamic text explorer */}
        <div className="analytics-card" style={{ display: 'flex', flexDirection: 'column', height: '308px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>🔍 مستكشف السجلات العاطفية المصفّرة</h3>
            <span className="badge badge-gray" style={{ fontSize: '.75rem' }}>{filteredData.length} نتيجة مطابقة</span>
          </div>

          {/* List Wrapper */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
            {filteredData.slice(0, 8).map(item => (
              <div key={item.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start', transition: 'all 0.15s' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '.85rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500 }}>{item.content}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="badge badge-gray" style={{ fontSize: '.65rem', padding: '2px 6px' }}>{item.type === 'post' ? '📄 منشور' : '💬 تعليق'}</span>
                    <span className="badge badge-blue" style={{ fontSize: '.62rem', padding: '2px 6px' }}>📌 {item.topic}</span>
                    {item.is_sarcastic && <span className="badge" style={{ fontSize: '.62rem', padding: '2px 6px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--violet)' }}>⚠️ سخرية</span>}
                    <span style={{ fontSize: '.7rem', color: '#64748b' }}>{item.engine_used && (item.engine_used.toLowerCase().includes('gemini') || item.engine_used.toLowerCase().includes('ai')) ? 'تم استخدام الـ AI' : (item.engine_used || 'المحرك المحلي')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                  <span style={{ 
                    fontSize: '.78rem', 
                    fontWeight: 800, 
                    color: item.sentiment === 'إيجابي' ? '#10b981' : item.sentiment === 'سلبي' ? '#ef4444' : '#f59e0b',
                    background: item.sentiment === 'إيجابي' ? 'rgba(16, 185, 129, 0.1)' : item.sentiment === 'سلبي' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {item.sentiment}
                  </span>
                  {item.engine_used && !(item.engine_used.toLowerCase().includes('gemini') || item.engine_used.toLowerCase().includes('ai')) && (
                    <span className="mono" style={{ fontSize: '.72rem', color: 'var(--text-secondary)' }}>{(item.score * 100).toFixed(0)}%</span>
                  )}
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '.85rem' }}>لا يوجد سجلات تطابق الفلاتر النشطة</div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

export default SentimentAnalytics
