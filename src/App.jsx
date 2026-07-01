import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'
import UpdatePassword from './UpdatePassword'

function App() {
  // --- Auth state ---
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)

  // --- Transaction state ---
  const [transactions, setTransactions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('pengeluaran')
  const [category, setCategory] = useState('Jajan & Makan')

  // Kategori yang di tweak biar lebih fungsional dan rapi aja
  const categories = [
    "Jajan & Makan",
    "Kopi & Warkop",
    "Transportasi",
    "Top-up & Game",
    "Langganan Digital",
    "Kebutuhan Kuliah",
    "Trading & Investasi",
    "Gaji/Pemasukan",
    "Lainnya"
  ]

  // Pantau status login & tangani link reset password
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
      }
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const getTransactions = async (userId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) setTransactions(data)
  }

  useEffect(() => {
    if (session?.user) getTransactions(session.user.id)
  }, [session])

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    if (!title || !amount) return alert('Catatan dan nominal harus diisi!')

    const { error } = await supabase
      .from('transactions')
      .insert([{
        title,
        amount: parseInt(amount),
        type,
        category,
        user_id: session.user.id,
      }])

    if (!error) {
      setTitle('')
      setAmount('')
      getTransactions(session.user.id)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setTransactions([])
  }

  const filteredTransactions = transactions.filter(trx =>
    trx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trx.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // --- Render gates ---
  if (authLoading) return null

  if (isRecovery) {
    return <UpdatePassword onDone={() => setIsRecovery(false)} />
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="app-container">
      {/* Header Ala DompetKu */}
      <div className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Keuanganku</h1>
            <p>Kelola arus kas harianmu</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Keluar</button>
        </div>
      </div>

      {/* Form Input Clean */}
      <div className="form-section">
        <form onSubmit={handleAddTransaction}>
          <div className="form-group">
            <label className="form-label">Catatan Transaksi</label>
            <input
              className="clean-input"
              placeholder="Contoh: Mie Gacoan / Kopi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nominal (Rp)</label>
            <input
              type="number"
              className="clean-input"
              placeholder="Contoh: 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="row-inputs form-group">
            <div style={{ flex: 1 }}>
              <label className="form-label">Jenis</label>
              <select className="clean-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="pengeluaran">Pengeluaran</option>
                <option value="pemasukan">Pemasukan</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Kategori</label>
              <select className="clean-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit">Simpan Transaksi</button>
        </form>
      </div>

      {/* List Transaksi */}
      <div className="list-section">
        <div className="section-title">
          <span>Riwayat Transaksi</span>
        </div>

        <input
          className="search-input"
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div>
          {filteredTransactions.map((trx) => (
            <div className="trx-card" key={trx.id}>
              <div className="trx-left">
                <span className="trx-title">{trx.title}</span>
                <span className="trx-category">{trx.category || 'Lainnya'}</span>
              </div>
              <div className="trx-right">
                <span className={`trx-amount ${trx.type === 'pemasukan' ? 'amount-in' : 'amount-out'}`}>
                  {trx.type === 'pemasukan' ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '24px', fontSize: '13px' }}>
              Belum ada transaksi.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App