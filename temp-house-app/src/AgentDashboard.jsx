import "./AgentDashboard.css";
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function AgentDashboard({ onBack }) {
  const [user, setUser] = useState(null)
  const [houses, setHouses] = useState([])
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('Self Contained')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
const [showAddProperty, setShowAddProperty] = useState(false)

  async function loadHouses(userId) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', userId)
      .order('created_at', { ascending: false })

    if (error) setMessage(error.message)
    else setHouses(data || [])
  }

  useEffect(() => {
    async function start() {
      if (!supabase) {
        setMessage('Supabase settings are missing.')
        return
      }

      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        setMessage('Please log in with your agent account first.')
        return
      }

      setUser(data.user)
      await loadHouses(data.user.id)
    }

    start()
  }, [])

  async function addHouse(e) {
    e.preventDefault()
    if (!user || !supabase) {
      setMessage('Please log in again.')
      return
    }

    setBusy(true)
    setMessage('')

    try {
      let imageUrl = ''

      if (photo) {
        const path = `${user.id}/${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(path, photo)

        if (uploadError) throw uploadError

        imageUrl = supabase.storage
          .from('property-images')
          .getPublicUrl(path).data.publicUrl
      }

      const { error } = await supabase.from('properties').insert({
        agent_id: user.id,
        title,
        location,
        price: Number(price),
        type,
        description,
        image_url: imageUrl,
      })

      if (error) throw error

      setTitle('')
      setLocation('')
      setPrice('')
      setType('Self Contained')
      setDescription('')
      setPhoto(null)
      e.target.reset()
      setMessage('Property added successfully!')
      await loadHouses(user.id)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  async function deleteHouse(id) {
    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) setMessage(error.message)
    else {
      setMessage('Listing deleted.')
      await loadHouses(user.id)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    onBack?.()
  }

  return (
    <main style={{ maxWidth: 900, margin: '24px auto', padding: 18, fontFamily: 'Arial, sans-serif', color: '#17324f' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ marginBottom: 5 }}>Agent Dashboard</h1>
          <p style={{ marginTop: 0, color: '#64748b' }}>Manage your rental properties</p>
        </div>
        <button onClick={logout}>Log Out</button>
      </header>

<button onClick={() => setShowAddProperty(true)}>+ ADD PROPERTY</button>
      <section style={{ background: '#f5f8fc', padding: 20, borderRadius: 16, marginTop: 20 }}>
        <h2>Add a Property</h2>
        <form onSubmit={addHouse} style={{ display: 'grid', gap: 12 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Property title" required />
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location, city and state" required />
          <input type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} placeholder="Rent price in naira (₦)" required />
          <select value={type} onChange={e => setType(e.target.value)}>
            <option>Self Contained</option>
            <option>Single Room</option>
            <option>1 Bedroom Flat</option>
            <option>2 Bedroom Flat</option>
            <option>3 Bedroom Flat</option>
            <option>Duplex</option>
            <option>Other</option>
          </select>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the property" rows="4" required />
          <label>Property photo
            <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />
          </label>
          <button disabled={busy} type="submit">{busy ? 'Saving...' : 'Add Property'}</button>
        </form>
      </section>

      {message && <p role="status">{message}</p>}

      <section style={{ marginTop: 28 }}>
        <h2>Your Listings ({houses.length})</h2>
        {houses.length === 0 && <p>Your property listings will appear here.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {houses.map(house => (
            <article key={house.id} style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
              {house.image_url && <img src={house.image_url} alt={house.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} />}
              <h3>{house.title}</h3>
              <p>{house.location}</p>
              <strong>₦{Number(house.price).toLocaleString('en-NG')}</strong>
              <p>{house.type}</p>
              <p>{house.description}</p>
              <button onClick={() => deleteHouse(house.id)}>Delete Listing</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
