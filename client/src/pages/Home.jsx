import { useNavigate } from "react-router-dom";
import {
  FaRocket,
  FaUsers,
  FaFileAlt,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const goToSignup = () => {
    try {
      navigate("/signup");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <FaRocket className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            CollabSpace
          </span>
        </div>

        {/* <div className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-cyan-300 transition-colors">
            Features
          </a>
          <a href="#about" className="hover:text-cyan-300 transition-colors">
            About
          </a>
          <a href="#contact" className="hover:text-cyan-300 transition-colors">
            Contact
          </a>
        </div> */}

        <button
          onClick={goToSignup}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Collaborate, Create, <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Innovate Together
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl">
          CollabSpace brings teams together to work on documents in real-time,
          share ideas, and boost productivity with seamless collaboration tools.
        </p>

        <button
          onClick={goToSignup}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-lg font-semibold flex items-center shadow-2xl"
        >
          Get Started Now
          <FaArrowRight className="ml-2" />
        </button>

        <div className="mt-16 rounded-2xl bg-white/5 p-6 backdrop-blur-sm border border-white/10 w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white/5">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Real-Time Collaboration
              </h3>
              <p className="text-gray-300">
                Work simultaneously with your team on documents with live
                updates
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/5">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <FaFileAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Documents</h3>
              <p className="text-gray-300">
                Create rich documents with text, images, and media in a powerful
                editor
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/5">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl shadow-lg">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Workspaces</h3>
              <p className="text-gray-300">
                Enterprise-grade security keeps your data safe and private
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
