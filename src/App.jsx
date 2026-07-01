import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'
import UpdatePassword from './Updatepassword'

function App() {
  // --- Auth state ---
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)


  const [transactions, setTransactions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('pengeluaran')
  const [category, setCategory] = useState('Jajan & Makan')

  // Kategori yang di-tweak agar lebih fungsional dan rapi
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

  const getTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (!error) setTransactions(data)
  }

  useEffect(() => {
    getTransactions()
  }, [])

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    if (!title || !amount) return alert('Catatan dan nominal harus diisi!')

    const { error } = await supabase
      .from('transactions')
      .insert([{ 
        title, 
        amount: parseInt(amount), 
        type, 
        category 
      }])

    if (!error) {
      setTitle('')
      setAmount('')
      getTransactions()
    }
  }

  const filteredTransactions = transactions.filter(trx => 
    trx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trx.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="app-container">
      {/* Header Ala DompetKu */}
      <div className="app-header">
        <h1>Keuanganku</h1>
        <p>Kelola arus kas harianmu</p>
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
            <p style={{textAlign: 'center', color: '#9ca3af', marginTop: '24px', fontSize: '13px'}}>
              Belum ada transaksi.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App