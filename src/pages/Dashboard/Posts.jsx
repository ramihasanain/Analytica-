import { useState, useEffect } from 'react'
import api from '../../services/api'

const allTopics = ['الكل', 'خدمة العملاء', 'جودة المنتج', 'التشكيلة الجديدة', 'العروض', 'سياسة الإرجاع', 'مشاكل تقنية']

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('الكل')
  const [expandedPost, setExpandedPost] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts/')
        // Map backend fields to frontend expected fields
        const mappedPosts = res.data.map(p => {
          const engagement = p.engagement_json || {}
          return {
            id: p.id,
            platform: p.platform || 'facebook',
            content: p.content,
            date: p.posted_at ? new Date(p.posted_at).toLocaleString('ar-EG') : 'غير محدد',
            sentiment: p.sentiment || 'محايد',
            score: p.score || 0.5,
            lang: p.detected_lang || 'ar',
            likes: engagement.likes || 0,
            shares: engagement.shares || 0,
            type: p.media_type || 'منشور',
            topic: p.topic || 'غير محدد',
            url: '#',
            comments: [] 
          }
        })
        setPosts(mappedPosts)
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError('تعذر جلب المنشورات. تأكد من تسجيل الدخول.')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const filtered = posts.filter(p => {
    const sentMatch = filter === 'all' || (filter === 'pos' && p.sentiment === 'إيجابي') || (filter === 'neg' && p.sentiment === 'سلبي') || (filter === 'neu' && p.sentiment === 'محايد')
    const platMatch = platformFilter === 'all' || p.platform === platformFilter
    const topicMatch = topicFilter === 'الكل' || p.topic === topicFilter
    return sentMatch && platMatch && topicMatch
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

        {/* Platform Filter */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '3px' }}>
          {[
            { key: 'all', label: 'كل المنصات' },
            { key: 'facebook', label: '📘 فيسبوك' },
            { key: 'twitter', label: '𝕏 X' },
          ].map(f => (
            <button key={f.key} onClick={() => setPlatformFilter(f.key)} className="btn" style={{ padding: '6px 14px', fontSize: '.83rem', fontWeight: 600, borderRadius: '6px', background: platformFilter === f.key ? 'var(--text-primary)' : 'transparent', color: platformFilter === f.key ? '#fff' : 'var(--text-secondary)', border: 'none' }}>
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
          {allTopics.map(t => <option key={t} value={t}>{t === 'الكل' ? '📌 كل المواضيع' : `📌 ${t}`}</option>)}
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
                  {post.platform === 'facebook' ? (
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    </div>
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" fill="#000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>
                    </div>
                  )}
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
                    💬 {post.comments.length} تعليق
                  </span>
                  
                  <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.82rem', color: 'var(--blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginRight: 'auto' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                    عرض المنشور الأصلي
                  </a>

                  {post.comments.length > 0 && (
                    <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="btn btn-ghost" style={{ fontSize: '.82rem', padding: '4px 12px', fontWeight: 700, color: 'var(--blue)' }}>
                      {expandedPost === post.id ? '▲ إخفاء التعليقات' : `▼ عرض ${post.comments.length} تعليق`}
                    </button>
                  )}
                </div>
              </div>

              {/* Sentiment Badge */}
              <div style={{ minWidth: '110px', textAlign: 'center', padding: '12px', background: post.sentiment === 'إيجابي' ? 'var(--green-light)' : post.sentiment === 'سلبي' ? 'var(--red-light)' : 'var(--amber-light)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                  {post.sentiment === 'إيجابي' ? '😊' : post.sentiment === 'سلبي' ? '😠' : '😐'}
                </div>
                <div style={{ fontWeight: 700, fontSize: '.85rem', color: post.sentiment === 'إيجابي' ? 'var(--green)' : post.sentiment === 'سلبي' ? 'var(--red)' : 'var(--amber)', marginBottom: '2px' }}>
                  {post.sentiment}
                </div>
                <div className="mono" style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>
                  {(post.score * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Expanded Comments */}
            {expandedPost === post.id && post.comments && post.comments.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  💬 التعليقات ({post.comments.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {post.comments.map(comment => (
                    <div key={comment.id} style={{ display: 'flex', gap: '16px', padding: '14px 18px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 800, flexShrink: 0 }}>
                        {comment.author.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '.88rem' }}>{comment.author}</span>
                          <span style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>{comment.date}</span>
                          <span style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>❤️ {comment.likes}</span>
                        </div>
                        <p style={{ fontSize: '.9rem', color: 'var(--text-primary)', lineHeight: 1.7, fontWeight: 500 }}>{comment.content}</p>
                      </div>
                      <span className={`badge ${comment.sentiment === 'إيجابي' ? 'badge-green' : comment.sentiment === 'سلبي' ? 'badge-red' : 'badge-amber'}`} style={{ flexShrink: 0, fontSize: '.78rem' }}>
                        {comment.sentiment} {(comment.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
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
