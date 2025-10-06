import React from 'react';
import './SkipLinks.css';

interface SkipLink {
  id: string;
  label: string;
  target: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const defaultSkipLinks: SkipLink[] = [
  {
    id: 'skip-main',
    label: 'Saltar al contenido principal',
    target: '#main-content'
  },
  {
    id: 'skip-nav',
    label: 'Saltar a la navegación',
    target: '#main-navigation'
  },
  {
    id: 'skip-search',
    label: 'Saltar a la búsqueda',
    target: '#search'
  }
];

const SkipLinks: React.FC<SkipLinksProps> = ({ links = defaultSkipLinks }) => {
  return (
    <div className="skip-links">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.target}
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector(link.target) as HTMLElement;
            if (target) {
              target.scrollIntoView();
              target.focus();
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default SkipLinks;






