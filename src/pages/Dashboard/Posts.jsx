import { useState, useEffect } from 'react'
import api from '../../services/api'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [profileFilter, setProfileFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('الكل')
  const [profiles, setProfiles] = useState([])
  const [topics, setTopics] = useState(['الكل'])
  const [expandedPost, setExpandedPost] = useState(null)
  const [expandedPostData, setExpandedPostData] = useState({})
  
  // Real-time automatic background analysis tracking state
  const [analysisStats, setAnalysisStats] = useState({ total: 0, analyzed: 0, percentage: 100 })

  const handleExpand = async (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null)
      return
    }
    setExpandedPost(postId)
    if (!expandedPostData[postId]) {
      try {
        const res = await api.get(`/posts/${postId}/details/`)
        setExpandedPostData(prev => ({...prev, [postId]: res.data}))
      } catch (err) {
        console.error('Error fetching post details:', err)
      }
    }
  }

  const fetchPostsAndProfiles = async (showLoading = false) => {
    if (showLoading) setLoading(true)
    try {
      const [postsRes, profilesRes, topicsRes] = await Promise.all([
        api.get('/posts/'),
        api.get('/profiles/'),
        api.get('/posts/topics/')
      ])
      
      // Filter profiles and posts to only include Facebook
      const fbProfiles = profilesRes.data.filter(prof => prof.platform === 'facebook')
      setProfiles(fbProfiles)
      setTopics(['الكل', ...topicsRes.data])
      
      const fbAllPosts = postsRes.data.filter(p => p.platform === 'facebook')
      
      // Calculate background analysis progress from all retrieved Facebook posts & comments
      const total = fbAllPosts.length
      const analyzed = fbAllPosts.filter(p => p.is_analyzed).length
      const percentage = total > 0 ? Math.round((analyzed / total) * 100) : 100
      setAnalysisStats({ total, analyzed, percentage })
      
      // Map backend fields to frontend expected fields
      const mappedPosts = fbAllPosts.map(p => {
        const engagement = p.engagement_json || {}
        return {
          id: p.id,
          profile_id: p.profile,
          platform: p.platform || 'facebook',
          content: p.content,
          date: p.posted_at ? new Date(p.posted_at).toLocaleString('ar-EG') : 'غير محدد',
          sentiment: p.sentiment || 'محايد',
          score: p.score || 0.5,
          lang: p.detected_lang || 'ar',
          likes: engagement.likes || 0,
          shares: engagement.shares || 0,
          comments: engagement.comments || 0,
          type: p.media_type || 'منشور',
          topic: p.topic || 'غير محدد',
          engine_used: p.engine_used || 'Local Lexicon',
          is_sarcastic: p.is_sarcastic || false,
          sarcasm_explanation: p.sarcasm_explanation || '',
          is_analyzed: p.is_analyzed || false,
          url: p.raw_json?.facebook_id ? 
            (p.raw_json.facebook_id.includes('_') ? `https://facebook.com/${p.raw_json.facebook_id.split('_')[0]}/posts/${p.raw_json.facebook_id.split('_')[1]}` : `https://facebook.com/${p.raw_json.facebook_id}`) 
            : '#'
        }
      })
      setPosts(mappedPosts.filter(p => p.type === 'post'))
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('تعذر جلب البيانات. تأكد من تسجيل الدخول.')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  // Initial Fetch on component mount (automatically triggers background analysis in Django)
  useEffect(() => {
    fetchPostsAndProfiles(true)
  }, [])

  // Auto-polling interval: Runs every 3 seconds if background analysis is active
  useEffect(() => {
    let interval = null
    if (analysisStats.percentage < 100) {
      interval = setInterval(() => {
        fetchPostsAndProfiles(false)
      }, 3000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [analysisStats.percentage])

  // Real-time comments update: Polling and refreshing details for the currently expanded post
  useEffect(() => {
    if (expandedPost && posts.length > 0) {
      const activePost = posts.find(p => p.id === expandedPost)
      if (activePost && !activePost.is_analyzed) {
        api.get(`/posts/${expandedPost}/details/`)
          .then(res => {
            setExpandedPostData(prev => ({...prev, [expandedPost]: res.data}))
          })
          .catch(err => console.error('Error polling expanded post details:', err))
      }
    }
  }, [posts, expandedPost])

  const filtered = posts.filter(p => {
    const sentMatch = filter === 'all' || (filter === 'pos' && p.sentiment === 'إيجابي') || (filter === 'neg' && p.sentiment === 'سلبي') || (filter === 'neu' && p.sentiment === 'محايد')
    const platMatch = platformFilter === 'all' || p.platform === platformFilter
    const topicMatch = topicFilter === 'الكل' || p.topic === topicFilter
    const profileMatch = profileFilter === 'all' || p.profile_id === parseInt(profileFilter)
    return sentMatch && platMatch && topicMatch && profileMatch
  })

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>المنشورات والتعليقات</h1>
        <p style={{ fontSize: '.92rem' }}>تصفّح جميع البيانات المسحوبة من منصاتك. اضغط على أي منشور لعرض التعليقات وتفاصيل التحليل.</p>
      </div>

      {loading && <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحميل البيانات...</div>}
      {error && <div style={{ padding: '20px', background: 'var(--red-light)', color: 'var(--red)', borderRadius: '8px' }}>{error}</div>}

      {!loading && !error && (
        <>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0% { opacity: 0.4; transform: scale(0.95); }
              50% { opacity: 1; transform: scale(1.05); }
              100% { opacity: 0.4; transform: scale(0.95); }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Dynamic Analysis Progress Tracker */}
          <div style={{ 
            background: 'var(--blue-soft)', 
            backdropFilter: 'blur(16px)', 
            border: '1px solid var(--blue-light)',
            padding: '20px 24px', 
            borderRadius: '16px', 
            marginBottom: '28px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.04)',
            color: 'var(--text-primary)',
            animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: analysisStats.percentage < 100 ? 'var(--blue)' : 'var(--green)', 
                  boxShadow: analysisStats.percentage < 100 ? '0 0 12px var(--blue)' : '0 0 12px var(--green)',
                  display: 'inline-block',
                  animation: 'pulse 1.8s infinite'
                }}></span>
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
                  {analysisStats.percentage < 100 ? '🧠 جاري تحليل وتصنيف البيانات تلقائياً...' : '✨ تم تصنيف وتحليل كافة البيانات بنجاح'}
                </h3>
              </div>
              <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: analysisStats.percentage < 100 ? 'var(--blue)' : 'var(--green)' }}>
                {analysisStats.percentage}%
              </span>
            </div>

            {/* Progress Bar Track */}
            <div style={{ 
              width: '100%', 
              height: '8px', 
              background: 'var(--bg-card)', 
              borderRadius: '999px', 
              overflow: 'hidden', 
              marginBottom: '16px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ 
                width: `${analysisStats.percentage}%`, 
                height: '100%', 
                background: analysisStats.percentage < 100 ? 'linear-gradient(90deg, var(--blue), #8b5cf6)' : 'linear-gradient(90deg, var(--green), #059669)',
                borderRadius: '999px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.8rem', color: 'var(--text-secondary)' }}>
              <span>
                {analysisStats.percentage < 100 
                  ? `جاري معالجة المنشورات والتعليقات بالخلفية... (تم تحليل ${analysisStats.analyzed} من أصل ${analysisStats.total})` 
                  : `التحليل مكتمل بالكامل! تم تصنيف جميع البيانات البالغ عددها (${analysisStats.total}) منشوراً وتعليقاً.`}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                {analysisStats.percentage < 100 ? 'المحرك النشط: MARBERT (محلي) 💻' : 'محرك التصنيف: الهجين الذكي 🌐'}
              </span>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Sentiment Filter */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '3px' }}>
          {[
            { key: 'all', label: 'الكل' },
            { key: 'pos', label: '😊 إيجابي' },
            { key: 'neg', label: '😠 سلبي' },
            { key: 'neu', label: '😐 محايد' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className="btn" style={{ padding: '6px 14px', fontSize: '.83rem', fontWeight: 600, borderRadius: '6px', background: filter === f.key ? 'var(--text-primary)' : 'transparent', color: filter === f.key ? '#fff' : 'var(--text-secondary)', border: 'none' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Topic Filter */}
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          style={{ padding: '9px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontFamily: 'var(--font-ar)', fontWeight: 600, fontSize: '.85rem', cursor: 'pointer', outline: 'none' }}
        >
          {topics.map(t => <option key={t} value={t}>{t === 'الكل' ? '📌 كل المواضيع' : `📌 ${t}`}</option>)}
        </select>

        {/* Profile Filter */}
        <select
          value={profileFilter}
          onChange={(e) => setProfileFilter(e.target.value)}
          style={{ padding: '9px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontFamily: 'var(--font-ar)', fontWeight: 600, fontSize: '.85rem', cursor: 'pointer', outline: 'none' }}
        >
          <option value="all">🏢 جميع الصفحات المربوطة</option>
          {profiles.map(prof => (
            <option key={prof.id} value={prof.id}>
              {prof.account_name || 'صفحة غير مسماة'}
            </option>
          ))}
        </select>

        <span className="badge badge-gray" style={{ marginRight: 'auto' }}>{filtered.length} نتيجة</span>
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(post => (
          <div key={post.id} className="card-flat" style={{ transition: 'all .2s', border: expandedPost === post.id ? '1px solid var(--blue)' : undefined, boxShadow: expandedPost === post.id ? '0 4px 20px rgba(37,99,235,.08)' : undefined }}>
            {/* Post Header & Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                {/* Meta Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </div>
                  <span className="badge badge-gray" style={{ fontSize: '.78rem' }}>{post.type}</span>
                  <span className="badge badge-blue" style={{ fontSize: '.75rem' }}>📌 {post.topic}</span>
                  <span style={{ fontSize: '.8rem', color: 'var(--text-tertiary)' }}>{post.date}</span>
                  <span className="badge badge-gray" style={{ fontSize: '.72rem' }}>{post.lang.toUpperCase()}</span>
                </div>

                {/* Content */}
                <p style={{ fontSize: '.95rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.9, marginBottom: '14px' }}>{post.content}</p>

                {/* Engagement + Link */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <span style={{ fontSize: '.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ❤️ {post.likes}
                  </span>
                  <span style={{ fontSize: '.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🔄 {post.shares}
                  </span>
                  <span style={{ fontSize: '.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    💬 {post.comments || 0} تعليق
                  </span>
                  
                  <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.82rem', color: 'var(--blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginRight: 'auto' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                    عرض المنشور الأصلي
                  </a>

                  <button onClick={() => handleExpand(post.id)} className="btn btn-ghost" style={{ fontSize: '.82rem', padding: '4px 12px', fontWeight: 700, color: 'var(--blue)' }}>
                    {expandedPost === post.id ? '▲ إخفاء التفاصيل' : `▼ عرض التفاعلات والتعليقات`}
                  </button>
                </div>
              </div>

              {/* Sentiment Badge */}
              {post.is_analyzed ? (
                <div style={{ minWidth: '130px', textAlign: 'center', padding: '12px', background: post.sentiment === 'إيجابي' ? 'var(--green-light)' : post.sentiment === 'سلبي' ? 'var(--red-light)' : 'var(--amber-light)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                    {post.sentiment === 'إيجابي' ? '😊' : post.sentiment === 'سلبي' ? '😠' : '😐'}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '.85rem', color: post.sentiment === 'إيجابي' ? 'var(--green)' : post.sentiment === 'سلبي' ? 'var(--red)' : 'var(--amber)', marginBottom: '2px' }}>
                    {post.sentiment}
                  </div>
                  {post.engine_used && (post.engine_used.toLowerCase().includes('gemini') || post.engine_used.toLowerCase().includes('ai')) ? (
                    <span className="badge" style={{ fontSize: '.68rem', padding: '4px 8px', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--violet)', whiteSpace: 'nowrap', fontWeight: 700, borderRadius: '4px', marginTop: '6px' }}>
                      🧠 تم استخدام الـ AI
                    </span>
                  ) : (
                    <>
                      <div className="mono" style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                        {(post.score * 100).toFixed(0)}%
                      </div>
                      <span className="badge badge-gray" style={{ fontSize: '.68rem', opacity: 0.8, whiteSpace: 'nowrap' }}>
                        ⚙️ {post.engine_used || 'المحرك المحلي'}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ 
                  minWidth: '130px', 
                  textAlign: 'center', 
                  padding: '16px 12px', 
                  background: 'rgba(59, 130, 246, 0.04)', 
                  border: '1px dashed rgba(59, 130, 246, 0.3)', 
                  borderRadius: 'var(--radius-sm)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span className="spinner" style={{ 
                    width: '18px', 
                    height: '18px', 
                    border: '2px solid var(--blue)', 
                    borderTopColor: 'transparent', 
                    borderRadius: '50%', 
                    display: 'inline-block', 
                    animation: 'spin 1s linear infinite' 
                  }}></span>
                  <div style={{ fontWeight: 700, fontSize: '.75rem', color: 'var(--blue)' }}>
                    جاري التحليل...
                  </div>
                </div>
              )}
            </div>

            {/* Expanded Comments and Reactions */}
            {expandedPost === post.id && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                
                {/* Sarcasm alert banner for the main post if flagged */}
                {post.is_sarcastic && (
                  <div style={{ 
                    background: 'rgba(124, 58, 237, 0.05)', 
                    border: '1px dashed #7c3aed', 
                    padding: '14px', 
                    borderRadius: 'var(--radius-sm)', 
                    marginBottom: '16px',
                    fontSize: '.9rem',
                    color: '#7c3aed',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}>
                    ⚠️ <strong>رصد سخرية مبطنة:</strong> {post.sarcasm_explanation || 'تم رصد نبرة تهكمية/سخرية مبطنة في السياق.'}
                  </div>
                )}

                {!expandedPostData[post.id] ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>جاري تحميل التفاصيل...</div>
                ) : (
                  <>
                    {/* Reactions */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        👍 تفاعلات المنشور ({expandedPostData[post.id].reactions.length})
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {expandedPostData[post.id].reactions.map(r => (
                          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg)', padding: '6px 12px', borderRadius: '20px', fontSize: '.82rem', border: '1px solid var(--border-light)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <span>{r.reaction_type === 'LOVE' ? '❤️' : r.reaction_type === 'HAHA' ? '😂' : r.reaction_type === 'WOW' ? '😮' : r.reaction_type === 'SAD' ? '😢' : r.reaction_type === 'ANGRY' ? '😠' : '👍'}</span>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.author_name}</span>
                          </div>
                        ))}
                        {expandedPostData[post.id].reactions.length === 0 && <span style={{ fontSize: '.8rem', color: 'var(--text-tertiary)' }}>لا يوجد تفاعلات مسحوبة</span>}
                      </div>
                    </div>

                    {/* Comments */}
                    <div>
                      <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '14px' }}>
                        💬 جدول التعليقات ({expandedPostData[post.id].comments.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {expandedPostData[post.id].comments.map(comment => (
                          <div key={comment.id} style={{ display: 'flex', gap: '16px', padding: '14px 18px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: 800, flexShrink: 0 }}>
                              {comment.author_name ? comment.author_name.charAt(0) : '?'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <span style={{ fontWeight: 700, fontSize: '.9rem' }}>{comment.author_name || 'مستخدم فيسبوك'}</span>
                              </div>
                              <p style={{ fontSize: '.9rem', color: 'var(--text-primary)', lineHeight: 1.7, fontWeight: 500, marginBottom: comment.is_sarcastic ? '8px' : 0 }}>{comment.content}</p>
                              
                              {/* Sarcasm flag on comments */}
                              {comment.is_sarcastic && (
                                <div style={{ fontSize: '.8rem', color: '#7c3aed', background: 'rgba(124, 58, 237, 0.05)', padding: '6px 12px', borderRadius: '4px', borderRight: '3px solid #7c3aed', display: 'inline-block' }}>
                                  ⚠️ <strong>رصد سخرية:</strong> {comment.sarcasm_explanation || 'تم رصد نبرة تهكمية/سخرية مبطنة.'}
                                </div>
                              )}
                            </div>
                            {comment.is_analyzed ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                <span className={`badge ${comment.sentiment === 'إيجابي' ? 'badge-green' : comment.sentiment === 'سلبي' ? 'badge-red' : 'badge-amber'}`} style={{ flexShrink: 0, fontSize: '.78rem' }}>
                                  {comment.sentiment} 
                                  {comment.engine_used && !(comment.engine_used.toLowerCase().includes('gemini') || comment.engine_used.toLowerCase().includes('ai')) && (
                                    ` ${(comment.score * 100).toFixed(0)}%`
                                  )}
                                </span>
                                <span style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{comment.topic}</span>
                                <span className="badge badge-gray" style={{ fontSize: '.65rem', padding: '2px 6px', opacity: 0.8 }}>
                                  {comment.engine_used && (comment.engine_used.toLowerCase().includes('gemini') || comment.engine_used.toLowerCase().includes('ai')) ? (
                                    '🧠 تم استخدام الـ AI'
                                  ) : (
                                    `⚙️ ${comment.engine_used || 'المحرك المحلي'}`
                                  )}
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--blue)', background: 'rgba(59, 130, 246, 0.04)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(59, 130, 246, 0.2)' }}>
                                <span className="spinner" style={{ width: '12px', height: '12px', border: '2px solid var(--blue)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                                <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--blue)' }}>جاري التحليل...</span>
                              </div>
                            )}
                          </div>
                        ))}
                        {expandedPostData[post.id].comments.length === 0 && <span style={{ fontSize: '.8rem', color: 'var(--text-tertiary)' }}>لا يوجد تعليقات مسحوبة</span>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>لا توجد منشورات.</div>}
      </>
      )}
    </div>
  )
}

export default Posts
