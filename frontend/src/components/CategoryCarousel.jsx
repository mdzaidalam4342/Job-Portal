
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCarousel.css";

const categories = [
  { name: "Frontend Developer", description: "Build beautiful web experiences", icon: "💻", color: "blue" },
  { name: "Backend Developer", description: "Power apps behind the scenes", icon: "⚙️", color: "purple" },
  { name: "Data Science", description: "Turn data into insights", icon: "📊", color: "green" },
  { name: "Graphic Designer", description: "Bring creative ideas to life", icon: "🎨", color: "orange" },
  { name: "FullStack Developer", description: "Build complete applications", icon: "🚀", color: "pink" },
];

const CategoryCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () =>
    setStartIndex((prev) => (prev + 1) % categories.length);

  const previousSlide = () =>
    setStartIndex((prev) => (prev - 1 + categories.length) % categories.length);

  const visibleCategories = Array.from(
    { length: 3 },
    (_, index) => categories[(startIndex + index) % categories.length]
  );

  const searchJobHandler = (category) => {
    navigate("/jobs?search=" + encodeURIComponent(category));
  };

  return (
    <section className="category-section">
      <div className="category-container">
        <div className="category-heading">
          <div>
            <span className="category-eyebrow">EXPLORE BY INTEREST</span>
            <h2>Find your <span>career path</span></h2>
            <p>Explore opportunities in the fields that inspire you.</p>
          </div>

          <div className="category-controls">
            <button type="button" className="carousel-button" onClick={previousSlide} aria-label="Previous categories">←</button>
            <button type="button" className="carousel-button" onClick={nextSlide} aria-label="Next categories">→</button>
          </div>
        </div>

        <div className="category-list">
          {visibleCategories.map((category) => (
            <button
              type="button"
              key={category.name}
              className={`category-card category-${category.color}`}
              onClick={() => searchJobHandler(category.name)}
            >
              <div className="category-card-top">
                <span className="category-icon" aria-hidden="true">{category.icon}</span>
                <span className="category-card-arrow" aria-hidden="true">↗</span>
              </div>

              <div className="category-card-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              <div className="category-card-link">
                Explore jobs <span>→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="category-pagination" aria-label="Carousel position">
          {categories.map((category, index) => (
            <button
              type="button"
              key={category.name}
              className={`category-dot ${index === startIndex ? "active" : ""}`}
              onClick={() => setStartIndex(index)}
              aria-label={`Show categories starting from ${category.name}`}
              aria-current={index === startIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
