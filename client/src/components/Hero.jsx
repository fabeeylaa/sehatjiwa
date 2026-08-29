import heroImg from "../assets/hero.png";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        
        <p className="hero-subtitle">
          Bersama SehatJiwa
        </p>

        <h1 className="hero-title">
          Ayo Mulai Hidup Sehat,
          <br />
          Mulai Dari Sekarang!!
        </h1>


        <button className="btn btn-primary">
          Get Started
        </button>
      </div>

      <div className="hero-image">
        <img
          src="/src/assets/hero1.jpg"
          alt="Mental health illustration"
        />
      </div>
    </section>
  );
}

export default Hero;