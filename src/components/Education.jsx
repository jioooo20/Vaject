import { GraduationCap, Calendar } from 'lucide-react'
import { education } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import SectionWrapper from './SectionWrapper'
import Card from './Card'

export default function Education() {
  return (
    <SectionWrapper>
      <SectionHeader
        icon={GraduationCap}
        label="Education"
        title="Academic Background"
        subtitle="My formal education and qualifications"
      />

      {/* Education Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {education.map((edu, idx) => (
          <Card
            key={edu.school}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="p-3 rounded-xl bg-accent-light/50 dark:bg-accent/10 flex-shrink-0">
                <GraduationCap size={22} className="text-accent" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Period */}
                <div className="flex items-center gap-1.5 text-xs text-accent font-medium mb-1.5">
                  <Calendar size={11} />
                  {edu.period}
                </div>

                {/* School */}
                <h3 className="font-semibold text-light-text dark:text-dark-text">
                  {edu.school}
                </h3>

                {/* Degree */}
                <p className="text-sm text-accent font-medium mt-0.5 mb-2">
                  {edu.degree}
                </p>

                {/* Description */}
                <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
