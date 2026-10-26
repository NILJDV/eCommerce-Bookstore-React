import { useState } from 'react'
import {
  ArrowDownUp,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'
import './App.css'

const books = [
  { id: 1, title: 'The Midnight Library', author: 'Matt Haig', price: 18.5, genre: 'Fiction', rating: '4.8', isbn: '9780525559474', note: 'A little hope goes a long way' },
  { id: 2, title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', price: 20, genre: 'Fiction', rating: '4.9', isbn: '9780593321201', note: 'For the forever friends' },
  { id: 3, title: 'Crying in H Mart', author: 'Michelle Zauner', price: 17, genre: 'Memoir', rating: '4.7', isbn: '9780525657743', note: 'A memoir with a full heart' },
  { id: 4, title: 'The Creative Act', author: 'Rick Rubin', price: 24, genre: 'Creativity', rating: '4.8', isbn: '9780593652886', note: 'Make room for the making' },
  { id: 5, title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', price: 19, genre: 'Nature', rating: '4.9', isbn: '9781571313560', note: 'A gentler way to see the world' },
  { id: 6, title: 'Small Things Like These', author: 'Claire Keegan', price: 16, genre: 'Fiction', rating: '4.6', isbn: '9780802158741', note: 'Quiet stories that stay loud' },
  { id: 7, title: 'How to Do Nothing', author: 'Jenny Odell', price: 18, genre: 'Creativity', rating: '4.5', isbn: '9781612197494', note: 'A field guide to paying attention' },
  { id: 8, title: 'The Anthropocene Reviewed', author: 'John Green', price: 18, genre: 'Memoir', rating: '4.8', isbn: '9780525555216', note: 'A love letter to being human' },
]

const genres = ['All books', 'Fiction', 'Memoir', 'Creativity', 'Nature']

function BookCard({ book, wished, quantity, onWishlist, onAdd }) {
  return (
    <article className="book-card">
      <div className="cover-wrap">
        <img className="book-cover" src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`} alt={`Cover of ${book.title}`} loading="lazy" />
        <button className={`icon-button wishlist-button${wished ? ' is-active' : ''}`} type="button" aria-label={wished ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`} aria-pressed={wished} onClick={() => onWishlist(book.id)}>
          <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
        </button>
        <span className="cover-note">{book.note}</span>
      </div>
      <div className="book-meta">
        <div className="book-heading">
          <div><span className="book-genre">{book.genre}</span><h3>{book.title}</h3><p className="book-author">{book.author}</p></div>
          <span className="rating" aria-label={`${book.rating} out of 5 stars`}>★ {book.rating}</span>
        </div>
        <div className="book-buy-row">
          <span className="book-price">${book.price.toFixed(2)}</span>
          <button className={`add-button${quantity ? ' added' : ''}`} type="button" onClick={() => onAdd(book)}>
            {quantity ? <><Check size={15} /> Added ({quantity})</> : <><Plus size={15} /> Add to bag</>}
          </button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [activeGenre, setActiveGenre] = useState('All books')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const query = search.trim().toLowerCase()
  const visibleBooks = books.filter((book) => {
    const matchesGenre = activeGenre === 'All books' || book.genre === activeGenre
    const matchesSearch = !query || `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query)
    return matchesGenre && matchesSearch
  })
  if (sort === 'price-low') visibleBooks.sort((a, b) => a.price - b.price)
  if (sort === 'price-high') visibleBooks.sort((a, b) => b.price - a.price)
  if (sort === 'title') visibleBooks.sort((a, b) => a.title.localeCompare(b.title))

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  function addToCart(book) {
    setCart((current) => {
      const existing = current.find((item) => item.id === book.id)
      return existing
        ? current.map((item) => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...book, quantity: 1 }]
    })
  }

  function updateQuantity(id, change) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0))
  }

  function toggleWishlist(id) {
    setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <>
      <div className="announcement"><Sparkles size={14} /> A little something for your next chapter: free shipping over $45 <ArrowRight size={14} /></div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Papertrail home"><span className="brand-mark"><BookOpen size={19} /></span>papertrail<span className="wordmark-period">.</span></a>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href="#bestsellers" onClick={() => setMenuOpen(false)}>Books</a>
          <a href="#bestsellers" onClick={() => { setActiveGenre('Fiction'); setMenuOpen(false) }}>Fiction</a>
          <a href="#our-story" onClick={() => setMenuOpen(false)}>Our little story</a>
        </nav>
        <div className="header-actions">
          <label className="search-box"><Search size={17} /><input aria-label="Search books" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a book..." />{search && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => setSearch('')}><X size={14} /></button>}</label>
          <button className="bag-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag with ${cartCount} items`}><ShoppingBag size={18} /><span className="bag-label">Bag</span><span className="bag-count">{cartCount}</span></button>
          <button className="mobile-menu icon-button" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> THE INDEPENDENT BOOKSHOP FOR EVERY MOOD</span>
            <h1 id="hero-title">A good book<br />finds <em>you.</em></h1>
            <p>For the slow mornings, the long rides, and the “just one more chapter” nights. Your next favorite is somewhere in here.</p>
            <a className="hero-cta" href="#bestsellers">Find your next read <ArrowRight size={17} /></a>
            <div className="hero-footnote"><span className="reader-stack"><i>J</i><i>M</i><i>A</i></span><span>Loved by readers in <strong>all 50 states</strong></span></div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1100&q=85" alt="A stack of books and a cup of coffee in a sunlit reading nook" />
            <div className="hero-sticker"><span>READ<br />MORE.<br /><b>WORRY</b><br />LESS.</span><span className="sticker-sparkle">✳</span></div>
            <div className="hero-caption"><span>THE SUNDAY MORNING EDIT</span><span>VOL. 04 — MADE FOR YOU</span></div>
          </div>
          <div className="hero-side-note">GOOD THINGS<br />ARE BETWEEN<br />THE COVERS <span>↘</span></div>
        </section>

        <section className="shop-section" id="bestsellers">
          <div className="section-intro">
            <div><span className="eyebrow section-eyebrow">A SHORTLIST FOR YOUR SHELF</span><h2>Stories worth staying in for<span>.</span></h2></div>
            <p>Picked by humans, for humans. No algorithms, just books we couldn’t stop thinking about.</p>
          </div>
          <div className="catalog-toolbar">
            <div className="genre-tabs" role="tablist" aria-label="Filter by genre">
              {genres.map((genre) => <button key={genre} type="button" role="tab" aria-selected={activeGenre === genre} className={activeGenre === genre ? 'active' : ''} onClick={() => setActiveGenre(genre)}>{genre}</button>)}
            </div>
            <label className="sort-control"><ArrowDownUp size={15} /><span className="sort-label">Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort books"><option value="featured">Featured</option><option value="title">Title A-Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><ChevronDown size={14} /></label>
          </div>
          <div className="results-line"><span>{search ? `Results for “${search}”` : activeGenre === 'All books' ? 'A few reader favorites' : activeGenre}</span><span>{visibleBooks.length} {visibleBooks.length === 1 ? 'book' : 'books'}</span></div>
          {visibleBooks.length > 0 ? <div className="book-grid">{visibleBooks.map((book) => <BookCard key={book.id} book={book} wished={wishlist.includes(book.id)} onWishlist={toggleWishlist} onAdd={addToCart} quantity={cart.find((item) => item.id === book.id)?.quantity || 0} />)}</div> : <div className="empty-results"><BookOpen size={26} /><h3>No pages turned up.</h3><p>Try another title, author, or genre.</p><button type="button" onClick={() => { setSearch(''); setActiveGenre('All books') }}>See all books</button></div>}
          <button className="browse-button" type="button" onClick={() => { setActiveGenre('All books'); setSearch('') }}>Browse the whole shelf <ArrowRight size={16} /></button>
        </section>

        <section className="story-band" id="our-story"><span className="story-star">✳</span><p>We believe the right book at the right time can feel a lot like <em>being understood.</em></p><a href="#bestsellers" aria-label="Explore the book collection"><ArrowRight size={20} /></a><span className="story-aside">INDEPENDENTLY<br />BOOKISH SINCE 2018</span></section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top"><span className="brand-mark"><BookOpen size={17} /></span>papertrail<span className="wordmark-period">.</span></a><span>Good books. Good people. That’s the whole thing.</span><span>© 2025 Papertrail Books</span></footer>

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="drawer-header"><div><span className="eyebrow section-eyebrow">YOUR NEXT CHAPTER</span><h2 id="cart-title">Your bag <span>({cartCount})</span></h2></div><button type="button" className="icon-button" aria-label="Close shopping bag" onClick={() => setCartOpen(false)}><X size={21} /></button></div>
          {cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={31} /><h3>It’s a little empty in here.</h3><p>Every great reading list starts somewhere.</p><button type="button" onClick={() => setCartOpen(false)}>Find your first book <ArrowRight size={15} /></button></div> : <>
            <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={`https://covers.openlibrary.org/b/isbn/${item.isbn}-M.jpg`} alt={`Cover of ${item.title}`} /><div className="cart-item-info"><h3>{item.title}</h3><p>{item.author}</p><strong>${(item.price * item.quantity).toFixed(2)}</strong><div className="quantity-stepper"><button type="button" aria-label={`Remove one ${item.title}`} onClick={() => updateQuantity(item.id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button type="button" aria-label={`Add one ${item.title}`} onClick={() => updateQuantity(item.id, 1)}><Plus size={13} /></button></div></div></div>)}</div>
            <div className="cart-summary"><div><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div><p>{cartTotal >= 45 ? 'Your shipping is on us.' : `You're $${(45 - cartTotal).toFixed(2)} away from free shipping.`}</p><button type="button" className="checkout-button" onClick={() => window.alert('Checkout is coming soon. Your bag is saved right here!')}>Continue to checkout <ArrowRight size={17} /></button><span className="checkout-note">Shipping & taxes calculated at checkout</span></div>
          </>}
        </aside>
      </div>}
    </>
  )
}

export default App
