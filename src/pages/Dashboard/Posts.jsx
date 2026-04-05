import { useState } from 'react'

const mockPosts = [
  {
    id: 61842, platform: 'facebook', content: 'أطلقنا اليوم التشكيلة الجديدة من منتجاتنا! تصاميم عصرية بجودة استثنائية. شاركونا رأيكم 🔥', date: '2026-04-05 14:22', sentiment: 'إيجابي', score: 0.92, lang: 'ar', likes: 245, shares: 38, type: 'منشور', topic: 'التشكيلة الجديدة',
    url: 'https://facebook.com/alofoq/posts/61842',
    comments: [
      { id: 'c1', author: 'سارة محمد', content: 'المنتج ممتاز جداً والتغليف كان رائع، سأكرر الطلب بكل تأكيد!', sentiment: 'إيجابي', score: 0.96, likes: 12, date: '14:35' },
      { id: 'c2', author: 'أحمد خالد', content: 'الأسعار مرتفعة شوي مقارنة بالسوق لكن الجودة تستحق بصراحة', sentiment: 'إيجابي', score: 0.68, likes: 5, date: '14:52' },
      { id: 'c3', author: 'فاطمة علي', content: 'متى يتوفر اللون الأزرق؟ أنتظره من فترة طويلة!', sentiment: 'محايد', score: 0.55, likes: 3, date: '15:10' },
    ]
  },
  {
    id: 61841, platform: 'twitter', content: 'تأخر التوصيل أكثر من أسبوع ولا أحد يرد على الاستفسارات.. خدمة سيئة جداً @alofoq_support', date: '2026-04-05 13:15', sentiment: 'سلبي', score: 0.94, lang: 'ar', likes: 58, shares: 14, type: 'تغريدة', topic: 'خدمة العملاء',
    url: 'https://x.com/user123/status/61841',
    comments: [
      { id: 'c4', author: '@user456', content: 'نفس المشكلة عندي! طلبت من 10 أيام وما وصل شيء', sentiment: 'سلبي', score: 0.91, likes: 8, date: '13:28' },
      { id: 'c5', author: '@alofoq_support', content: 'نعتذر عن التأخير. تم تحويل طلبك لفريق المتابعة وسيتم التواصل معك خلال ساعة', sentiment: 'محايد', score: 0.52, likes: 2, date: '13:45' },
    ]
  },
  {
    id: 61840, platform: 'facebook', content: 'عرض الجمعة البيضاء 🎉 خصم 40% على جميع المنتجات! العرض ساري لمدة 48 ساعة فقط', date: '2026-04-05 12:40', sentiment: 'إيجابي', score: 0.88, lang: 'ar', likes: 892, shares: 156, type: 'منشور', topic: 'العروض',
    url: 'https://facebook.com/alofoq/posts/61840',
    comments: [
      { id: 'c6', author: 'ليلى أحمد', content: 'عرض ممتاز! طلبت 3 قطع الحين 😍', sentiment: 'إيجابي', score: 0.97, likes: 34, date: '12:55' },
      { id: 'c7', author: 'محمد سعيد', content: 'الموقع بطيء جداً ويعلق كل ما أحاول أطلب. يحتاج صيانة عاجلة!', sentiment: 'سلبي', score: 0.91, likes: 15, date: '13:02' },
      { id: 'c8', author: 'نورة عبدالله', content: 'هل العرض يشمل الشحن المجاني؟', sentiment: 'محايد', score: 0.50, likes: 7, date: '13:10' },
      { id: 'c9', author: 'خالد يوسف', content: 'أفضل عرض شفته هالسنة بصراحة 🔥🔥', sentiment: 'إيجابي', score: 0.95, likes: 21, date: '13:18' },
    ]
  },
  {
    id: 61839, platform: 'twitter', content: 'Amazing product quality from @alofoq! The packaging was premium and delivery was fast. Highly recommend 🔥', date: '2026-04-05 11:30', sentiment: 'إيجابي', score: 0.98, lang: 'en', likes: 124, shares: 28, type: 'تغريدة', topic: 'جودة المنتج',
    url: 'https://x.com/user789/status/61839',
    comments: [
      { id: 'c10', author: '@buyer_uk', content: 'Agree! Best purchase this year', sentiment: 'إيجابي', score: 0.94, likes: 6, date: '11:45' },
    ]
  },
  {
    id: 61838, platform: 'facebook', content: 'نود إعلامكم بتحديث سياسة الإرجاع: يمكنكم الآن استرجاع المنتج خلال 30 يوماً بدلاً من 14 يوماً', date: '2026-04-05 10:05', sentiment: 'محايد', score: 0.61, lang: 'ar', likes: 67, shares: 12, type: 'منشور', topic: 'سياسة الإرجاع',
    url: 'https://facebook.com/alofoq/posts/61838',
    comments: [
      { id: 'c11', author: 'هند محمود', content: 'خطوة ممتازة! هذا يعطي ثقة أكبر للشراء', sentiment: 'إيجابي', score: 0.89, likes: 9, date: '10:20' },
      { id: 'c12', author: 'عمر حسن', content: 'طيب أنا طلبت إرجاع من أسبوع وما رد علي أحد!', sentiment: 'سلبي', score: 0.88, likes: 4, date: '10:35' },
    ]
  },
  {
    id: 61837, platform: 'twitter', content: 'الموقع معطل من ساعتين ولا أقدر أتصفح المنتجات @alofoq هل في مشكلة تقنية؟', date: '2026-04-04 22:11', sentiment: 'سلبي', score: 0.87, lang: 'ar', likes: 35, shares: 5, type: 'تغريدة', topic: 'مشاكل تقنية',
    url: 'https://x.com/user321/status/61837',
    comments: [
      { id: 'c13', author: '@dev_team', content: 'نعمل على حل المشكلة حالياً. شكراً لإبلاغنا', sentiment: 'محايد', score: 0.50, likes: 1, date: '22:30' },
    ]
  },
  {
    id: 61836, platform: 'facebook', content: 'وصلني الطلب اليوم والتغليف كان أكثر من رائع! شكراً لكم على الاهتمام بالتفاصيل ❤️', date: '2026-04-04 20:30', sentiment: 'إيجابي', score: 0.96, lang: 'ar', likes: 189, shares: 22, type: 'تعليق', topic: 'جودة المنتج',
    url: 'https://facebook.com/alofoq/posts/61836',
    comments: []
  },
]

const allTopics = ['الكل', 'خدمة العملاء', 'جودة المنتج', 'التشكيلة الجديدة', 'العروض', 'سياسة الإرجاع', 'مشاكل تقنية']

const Posts = () => {
  const [filter, setFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('الكل')
  const [expandedPost, setExpandedPost] = useState(null)

  const filtered = mockPosts.filter(p => {
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
            {expandedPost === post.id && post.comments.length > 0 && (
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
    </div>
  )
}

export default Posts
