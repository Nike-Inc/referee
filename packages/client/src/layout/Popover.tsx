import * as React from 'react';
import * as Bootstrap from 'react-bootstrap';
import './Popover.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export const Popover = ({
  header,
  text,
  color,
  additionalContainerStyleTag,
  additionalHeaderStyleTag,
  additionalContentStyleTag
}: {
  header?: string;
  text: JSX.Element | string;
  color: string;
  additionalContainerStyleTag?: string;
  additionalHeaderStyleTag?: string;
  additionalContentStyleTag?: string;
}): JSX.Element => {
  // This implementation is a temporary solution until the release of react-bootstrap v1.0.0-beta.11.
  const { Popover } = Bootstrap;
  const PopoverContent = (Bootstrap as any).PopoverContent;
  const PopoverTitle = (Bootstrap as any).PopoverTitle;

  return (
    <div className="tooltip-container">
      <OverlayTrigger
        placement="right"
        overlay={
          <Popover id="popover-basic" bsPrefix={additionalContainerStyleTag}>
            <PopoverTitle as="h3" bsPrefix={additionalHeaderStyleTag}>
              {header}
            </PopoverTitle>
            <PopoverContent bsPrefix={additionalContentStyleTag}>{text}</PopoverContent>
          </Popover>
        }
      >
        <FontAwesomeIcon className="tooltip-info" size="sm" color={color} icon={faQuestionCircle} />
      </OverlayTrigger>
    </div>
  );
};
