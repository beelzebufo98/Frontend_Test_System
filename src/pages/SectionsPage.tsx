// import { useState, useEffect } from 'react';
// import { Card, Flex, Text, Link } from '@gravity-ui/uikit';
// import { axiosClient, SectionModel } from '../api';

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
//     <Flex direction="column" gap={4}>
//       <Text variant="header-1" className="text-center mb-8">
//         Test Sections
//       </Text>
//       <Flex direction="column" gap={4} className="w-full max-w-2xl mx-auto">
//         {sections.map((section) => (
//           <Card key={section.id} className="w-full hover:bg-gray-50 transition-colors">
//             <Link href={`/sections/${section.id}`}>
//               <Flex direction="column" gap={2} className="p-4">
//                 <Text variant="header-2">{section.name}</Text>
//                 <Text variant="body-1" color="secondary">
//                   Click to view tests in this section
//                 </Text>
//               </Flex>
//             </Link>
//           </Card>
//         ))}
//       </Flex>
//     </Flex>
//   );
// };

// export default SectionsPage;
import { useState, useEffect } from 'react';
import { Card, Flex, Text, Link } from '@gravity-ui/uikit';
import { axiosClient, SectionModel } from '../api';

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
      <Text variant="header-1" className="page-title">
        Explore Test Sections
      </Text>
      <Flex direction="row" gap={6} justifyContent="center" className="cards-container">
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
    </div>
  );
};

export default SectionsPage;
