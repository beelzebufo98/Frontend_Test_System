// import { useState, useEffect } from 'react';
// import { Card, Flex, Text, Link } from '@gravity-ui/uikit';
// import { axiosClient, SectionModel } from '../api';

// const Divider = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
//   <div className={`w-full flex items-center gap-4 my-8 px-8 ${className}`}>
//     <div className="h-1 flex-1 bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ff9a9e] rounded-full" />
//     {children && (
//       <div className="px-4 py-2 bg-white rounded-lg shadow-md">
//         {children}
//       </div>
//     )}
//     <div className="h-1 flex-1 bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ff9a9e] rounded-full" />
//   </div>
// );

// const Quote = ({ text }: { text: string }) => (
//   <div className="w-full max-w-2xl mx-auto text-center my-6 px-4">
//     <blockquote className="italic text-gray-600 border-l-4 border-[#fbc2eb] pl-4 py-2">
//       "{text}"
//     </blockquote>
//   </div>
// );

// const SectionsPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [sections, setSections] = useState<Array<SectionModel>>([]);

//   useEffect(() => {
//     setLoading(true);
//     axiosClient
//       .get('/sections')
//       .then((r) => setSections(r.data))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Text>Loading...</Text>;

//   return (
//     <div className="main-container">
//       {/* Top decorative line */}
//       <Divider />
      
//       <Text variant="header-1" className="page-title">
//         Разделы тестирования
//       </Text>
      
//       <Flex direction="row" gap={6} justifyContent="center" className="cards-container">
//         {sections.map((section, index) => (
//           <Card
//             key={section.id}
//             className={`custom-card card-${index % 3}`}
//           >
//             <Link href={`/sections/${section.id}`} className="card-link">
//               <Flex direction="column" gap={2} className="card-content">
//                 <Text variant="header-2" className="card-title">{section.name}</Text>
//                 <Text variant="body-1" color="secondary" className="card-description">
//                   Discover tests in this section.
//                 </Text>
//               </Flex>
//             </Link>
//           </Card>
//         ))}
//       </Flex>

//       {/* Bottom decorative line with feedback form link */}
//       <Divider>
//         <Link 
//           href="https://docs.google.com/forms/d/e/1FAIpQLSfTqaxodS74iVIcSv3BWMyU6ZuGSvPjXmY_YG8OXvNpGVYKnw/viewform"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-[#37474f] hover:text-[#ff9a9e] transition-colors no-underline font-medium"
//         >
//           Форма обратной связи
//         </Link>
//       </Divider>

//       {/* Quote */}
//       <Quote text="Улыбка деятеля искусств, способного сохранять гармонию даже в хаосе, вдохновляет и притягивает." />
//     </div>
//   );
// };

// export default SectionsPage;
import { useState, useEffect } from 'react';
import { Card, Flex, Text, Link } from '@gravity-ui/uikit';
import { axiosClient, SectionModel } from '../api';

const Divider = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`w-full flex items-center gap-4 my-8 px-8 ${className}`}>
    <div className="h-1 flex-1 bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ff9a9e] rounded-full" />
    {children && (
      <div className="px-4 py-2 bg-white rounded-lg shadow-md">
        {children}
      </div>
    )}
    <div className="h-1 flex-1 bg-gradient-to-r from-[#ff9a9e] via-[#fad0c4] to-[#ff9a9e] rounded-full" />
  </div>
);

const SectionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Array<SectionModel>>([]);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get('/sections')
      .then((r) => setSections(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <div className="main-container">
      <Divider />
      
      <Text variant="header-1" className="page-title">
        Разделы тестирования
      </Text>
      
      <Flex direction="row" gap={6} justifyContent="center" className="cards-container mb-32">
        {sections.map((section, index) => (
          <Card
            key={section.id}
            className={`custom-card card-${index % 3}`}
          >
            <Link href={`/sections/${section.id}`} className="card-link">
              <Flex direction="column" gap={2} className="card-content">
                <Text variant="header-2" className="card-title">{section.name}</Text>
                <Text variant="body-1" color="secondary" className="card-description">
                  Discover tests in this section.
                </Text>
              </Flex>
            </Link>
          </Card>
        ))}
      </Flex>

      {/* Новая структура футера */}
      <div className="footer-content">
        <div className="footer-divider" />
        <Flex direction="column" alignItems="center" gap={3}>
          <Link 
            href="https://docs.google.com/forms/d/e/1FAIpQLSfTqaxodS74iVIcSv3BWMyU6ZuGSvPjXmY_YG8OXvNpGVYKnw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="feedback-button"
          >
            Форма обратной связи
          </Link>
          
          <div className="text-center text-gray-600 italic">
            Улыбка деятеля искусств, способного сохранять гармонию даже в хаосе, вдохновляет и притягивает🧐
          </div>
          
        </Flex>
      </div>
    </div>
  );
};

export default SectionsPage;