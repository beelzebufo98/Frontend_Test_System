import { useState, useEffect } from 'react'
import { Card, Flex, Text, Link } from '@gravity-ui/uikit'
import { axiosClient, SectionModel } from '../api'

const SectionsPage = () => {
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<Array<SectionModel>>([])

  useEffect(() => {
    setLoading(true)
    axiosClient
      .get('/sections')
      .then((r) => setSections(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Text>Loading...</Text>

  return (
    <div className="main-container">
      <Text variant="header-1" className="page-title">
        Разделы тестирования
      </Text>

      <Flex direction="column" gap={6} justifyContent="center" className="cards-container mb-32">
        {sections.map((section, index) => (
          <Link key={section.id} href={`/sections/${section.id}`} className="card-link">
            <Card className={`custom-card card-${index % 3}`}>
              <Flex direction="column" gap={2} className="card-content">
                <Text variant="header-2" className="card-title">
                  {index + 1}.{section.name}
                </Text>
              </Flex>
            </Card>
          </Link>
        ))}
      </Flex>

      {/* Новая структура футера */}
      <div className="footer-content">
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
  )
}

export default SectionsPage
