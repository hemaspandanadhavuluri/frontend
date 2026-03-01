import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Testimonials.css';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || ''
});

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const formRef = useRef(null);

  /* =============================
     LOAD TESTIMONIALS
  ============================= */
  useEffect(() => {
    api.get('/api/testimonials')
      .then(res => {
        setTestimonials(res.data);
        if (res.data.length > 0) setActiveIndex(0);
      })
      .catch(err => console.error(err));
  }, []);

  /* =============================
     AUTO SLIDE
  ============================= */
  useEffect(() => {
    if (testimonials.length > 1) {
      const timer = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showForm]);

  const getCardStyle = (index) => {
    if (index === activeIndex) return 'card-active';
    if (index === (activeIndex + 1) % testimonials.length) return 'card-next';
    if (index === (activeIndex - 1 + testimonials.length) % testimonials.length) return 'card-prev';
    return 'card-hidden';
  };

  /* =============================
     SUBMIT FORM
  ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim() || !quote.trim()) {
      setFormError('Name and review are required.');
      return;
    }

    try {
      setSubmitting(true);

      await api.post('/api/testimonials', {
        name: name.trim(),
        role: role.trim(),
        quote: quote.trim()
      });

      const refreshed = await api.get('/api/testimonials');
      setTestimonials(refreshed.data);
      setActiveIndex(0);

      setName('');
      setRole('');
      setQuote('');
      setShowForm(false);
      setFormSuccess('Thank you! Your review has been submitted.');

    } catch (err) {
      setFormError('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="testimonials-section">

      <div className="section-header text-center">
        <h2 className="section-title">
          Global <span className="highlight-text">Voices</span>
        </h2>
        <p className="section-subtitle">Real stories. Real Impact.</p>
      </div>

      {!showForm && (
        <div className="text-center" style={{ marginBottom: 20 }}>
          <button
            className="add-review-button"
            onClick={() => setShowForm(true)}
          >
            Add Your Review
          </button>
        </div>
      )}

      {showForm && (
        <div ref={formRef}>
          <form className="review-form" onSubmit={handleSubmit}>

            {formError && <p className="form-error">{formError}</p>}
            {formSuccess && <p className="form-success">{formSuccess}</p>}

            <label>Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              required
            />

            <label>Program / University</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={submitting}
              placeholder="e.g. MS in CS, University of Texas"
            />

            <label>Your Review *</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              disabled={submitting}
              required
            />

            <div className="form-buttons">
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {testimonials.length > 0 && !showForm && (
        <div className="deck-container">
          <div className="card-deck">
            {testimonials.map((item, index) => (
              <div
                key={item._id}
                className={`deck-card ${getCardStyle(index)}`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="deck-content">
                  <div className="deck-quote-icon">“</div>
                  <p>{item.quote}</p>

                  <div className="deck-author">
                    <div>
                      <h4>{item.name}</h4>
                      <span>{item.role}</span>
                    </div>
                  </div>

                </div>
                <div className="deck-glow"></div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};

export default Testimonials;