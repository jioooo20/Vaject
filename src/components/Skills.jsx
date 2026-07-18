import { Code2, Database, Server, Wrench } from 'lucide-react'
import { skills, techColors } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import SectionWrapper from './SectionWrapper'
import Card from './Card'

const categoryIcons = {
  Frontend: Code2,
  Backend: Server,
  Database: Database,
  'DevOps & Tools': Wrench,
}

export default function Skills() {
  return (
    <SectionWrapper>
      <SectionHeader
        icon={Code2}
        label="Skills"
        title="Tech Stack"
        subtitle="Technologies I work with on a daily basis"
      />

      {/* Skills Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((category, catIdx) => {
          const Icon = categoryIcons[category.category] || Code2
          return (
            <Card
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-light-border dark:border-dark-border">
                <div className="p-2 rounded-lg bg-accent-light/50 dark:bg-accent/10">
                  <Icon size={18} className="text-accent" />
                </div>
                <h3 className="font-semibold text-sm text-light-text dark:text-dark-text">
                  {category.category}
                </h3>
              </div>

              {/* Skills as Tags */}
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-transform duration-200 hover:scale-105 ${
                      techColors[skill] || 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
