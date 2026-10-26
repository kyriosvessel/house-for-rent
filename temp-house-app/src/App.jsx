import SiteFrame from "./SiteFrame";
import { useState } from 'react'
import AgentDashboard from './AgentDashboard.jsx'
import AgentAuth from './AgentAuth.jsx'
import './App.css'

const houses = [
  { id: 1, title: 'Self Contained Apartment', location: 'Benin City, Edo State', price: 350000, type: 'Self Contained', icon: '🏠' },
  { id: 2, title: 'Modern 2 Bedroom Flat', location: 'Ikeja, Lagos State', price: 850000, type: '2 Bedroom', icon: '🏢' },
  { id: 3, title: 'Affordable Single Room', location: 'Ibadan, Oyo State', price: 120000, type: 'Single Room', icon: '🏡' },
]

function App() {
  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [search, setSearch] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showAgent, setShowAgent] = useState(false)
  const [agentLoginMode, setAgentLoginMode] = useState(false)
if (showDashboard) return <SiteFrame><AgentDashboard onBack={() => { setShowDashboard(false); setShowAgent(true); }} /></SiteFrame>;
  if (showAgent) return <SiteFrame><AgentAuth onBack={() => setShowAgent(false)} initialLogin={agentLoginMode} onLogin={() => { setShowAgent(false); setShowDashboard(true); }} /></SiteFrame>;

  const filteredHouses = houses.filter(house =>
    (!location || `${house.location} ${house.title}`.toLowerCase().includes(location.toLowerCase())) &&
    (!maxPrice || house.price <= Number(maxPrice))
  )

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#home"><span>⌂</span> HOUSE FOR RENT</a>
        <a className="agent-link" href="#agent" onClick={(e) => { e.preventDefault(); setShowAgent(true) }}>Agent Sign Up</a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT HOME STARTS HERE</span>
            <h1>Find a house<br />you can <span>call home.</span></h1>
            <p>Discover houses and apartments for rent across Nigeria.</p>

            <form className="search-box" onSubmit={e => { e.preventDefault(); setSearch(true) }}>
              <label>
                Location
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="City, state or area"
                />
              </label>
              <label>
                Maximum yearly rent
                <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
                  <option value="">Any budget</option>
                  <option value="200000">₦200,000</option>
                  <option value="400000">₦400,000</option>
                  <option value="600000">₦600,000</option>
                  <option value="1000000">₦1,000,000</option>
                </select>
              </label>
              <button type="submit" className="search-button">Search Houses</button>
            </form>
            <small>Search for houses without creating an account.</small>
          </div>
        </section>

        <section className="listings" id="houses">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE RENTALS</span>
              <h2>{search ? 'Search Results' : 'Latest Houses'}</h2>
            </div>
            <span className="house-count">{filteredHouses.length} houses</span>
          </div>

          {filteredHouses.length ? (
            <div className="house-grid">
              {filteredHouses.map(house => (
                <article className="house-card" key={house.id}>
                  <div className="house-image"><img src={house.id === 1 ? "https://images.unsplash.com/photo-1600596246004-5f4f5f5a5b8a?auto=format&fit=crop&w=900&q=80" : house.id === 2 ? "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"} alt={house.title} loading="lazy" /><span className="available">Available</span></div>
                  <div className="house-info">
                    <span className="house-type">{house.type}</span>
                    <h3>{house.title}</h3>
                    <p className="location">📍 {house.location}</p>
                    <p className="price">₦{house.price.toLocaleString('en-NG')} <small>/ year</small></p>
                    <a className="contact-button" href="#agent">View Contact</a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">No sample houses match your search. Try another location or budget.</p>
          )}
          <p className="demo-note">Sample listings for demonstration. Real agent listings will be connected later.</p>
        </section>

        <section className="agent-section" id="agent">
          <div>
            <span className="eyebrow">ARE YOU A PROPERTY AGENT?</span>
            <h2>Have a house to rent?</h2>
            <p>Join HOUSE FOR RENT and help people find their next home.</p>
          </div>
      <div className="agent-actions"><button className="agent-button" onClick={() => { setAgentLoginMode(true); setShowAgent(true); }}>Agent Login</button><button className="agent-button" onClick={() => { setAgentLoginMode(false); setShowAgent(true); }}>Agent Sign Up</button></div>
        </section>
      </main>

      <footer>
        <a className="logo" href="#home"><span>⌂</span> HOUSE FOR RENT</a>
        <p>Making it easier to find a home in Nigeria.</p>
        <small>© {new Date().getFullYear()} HOUSE FOR RENT</small>
      </footer>
    </div>
  )
}

export default App
