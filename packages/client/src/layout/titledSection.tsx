import * as React from 'react';
import classNames from 'classnames';
import './titledSection.scss';
import { Popover } from './Popover';

export interface ISectionProps {
  title: string;
  children?: any;
  additionalClassname?: string;
  tooltipHeader?: string;
  tooltipText?: JSX.Element | string;
}

export default function TitledSection({
  title,
  children,
  additionalClassname,
  tooltipHeader,
  tooltipText
}: ISectionProps): JSX.Element {
  return (
    <section className={classNames('titled-section', additionalClassname)}>
      <div className="titled-section-header">
        <div className="titled-section-title">{title}</div>
        {tooltipText && tooltipHeader && <Popover header={tooltipHeader} text={tooltipText} color="white" />}
      </div>
      {children !== undefined && <div className="titled-section-contents">{children}</div>}
    </section>
  );
}
