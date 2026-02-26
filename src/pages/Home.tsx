import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Search, Globe, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

const Home = () => {
  React.useEffect(() => {
    logger.info('Home page mounted');
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-700 blur-3xl opacity-50"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-purple-600 blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Shape Your Future with the <span className="text-indigo-300">Right Education</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover top colleges, check eligibility, and take aptitude tests to find your perfect career path. Your journey to success starts here.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-lg px-8 py-6 shadow-lg transition-transform hover:scale-105">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-indigo-400 text-indigo-100 hover:bg-indigo-800 hover:text-white font-bold text-lg px-8 py-6 transition-colors">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-800/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
                  alt="Students on Campus" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-indigo-900/10"></div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Trusted by</p>
                    <p className="text-lg font-bold text-gray-900">10,000+ Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Know</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive tools and information to help students and parents make informed decisions about education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="h-10 w-10 text-indigo-600" />}
              title="College Search"
              description="Find engineering and management universities in India and abroad based on rankings, fees, and region."
            />
            <FeatureCard 
              icon={<BookOpen className="h-10 w-10 text-indigo-600" />}
              title="Aptitude Tests"
              description="Assess your skills with our verbal, quantitative, and general knowledge aptitude tests."
            />
            <FeatureCard 
              icon={<GraduationCap className="h-10 w-10 text-indigo-600" />}
              title="Eligibility Check"
              description="Check your eligibility for various courses and institutions based on your academic records."
            />
          </div>
        </div>
      </section>

      {/* Info Section with Image */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="https://picsum.photos/seed/study/800/600" 
                alt="Students Studying" 
                className="rounded-2xl shadow-xl w-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Career Guidance?
              </h2>
              <div className="space-y-6">
                <InfoItem 
                  icon={<Globe className="h-6 w-6 text-indigo-600" />}
                  title="Global Opportunities"
                  description="Explore education options both in India and overseas to broaden your horizons."
                />
                <InfoItem 
                  icon={<Award className="h-6 w-6 text-indigo-600" />}
                  title="Personalized Recommendations"
                  description="Get a tailored list of colleges that match your entrance exam results and preferences."
                />
                <InfoItem 
                  icon={<Users className="h-6 w-6 text-indigo-600" />}
                  title="Expert Support"
                  description="Access campus support services, scholarship schemes, and detailed placement options."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students who have found their dream colleges through our platform.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-lg px-10 py-4 rounded-full shadow-lg">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
    <div className="bg-white p-4 rounded-full w-fit mb-6 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const InfoItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 mt-1">
      <div className="bg-indigo-100 p-2 rounded-lg">
        {icon}
      </div>
    </div>
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default Home;
