import * as React from 'react';
import classNames from 'classnames';

import './titledSection.scss';

export interface ISectionProps {
  title: string;
  children?: any;
  additionalClassname?: string;
}

export default function TitledSection({ title, children, additionalClassname }: ISectionProps): JSX.Element {
  return (
    <section className={classNames('titled-section', additionalClassname)}>
      <div className="titled-section-header">
        <div className="titled-section-title">{title}</div>
      </div>
      <div className="titled-section-contents">{children}</div>
    </section>
  );
}
