import * as React from 'react';
import { observer } from 'mobx-react';
import TitledSection from '../../layout/titledSection';
import { TextInputGroup } from '../../layout/TextInputGroup';
import './NameAndDescriptionSection.scss';
import { KvMap } from '../../domain/CustomTypes';

export const NameAndDescriptionSection = observer(
  ({
    name,
    description,
    updateConfigName,
    updateConfigDescription,
    touch,
    touched,
    errors,
    hasTheCopyOrSaveButtonBeenClicked
  }: {
    name: string;
    description: string;
    updateConfigName: (value: string) => void;
    updateConfigDescription: (value: string) => void;
    touch: (name: string) => void;
    touched: KvMap<boolean>;
    errors: KvMap<string>;
    hasTheCopyOrSaveButtonBeenClicked: boolean;
  }): JSX.Element => {
    return (
      <TitledSection title="Name and Description" additionalClassname="name-and-description">
        <TextInputGroup
          name="config-name"
          label="Configuration Name"
          value={name}
          onChange={(e: any) => {
            updateConfigName(e.target.value);
          }}
          onBlur={() => {
            touch('name');
          }}
          touched={touched['name'] || hasTheCopyOrSaveButtonBeenClicked}
          error={errors['name']}
        />
        <TextInputGroup
          name="config-description"
          label="Configuration Description"
          value={description}
          area={true}
          rows="1"
          onChange={(e: any) => {
            updateConfigDescription(e.target.value);
          }}
          onBlur={() => {
            touch('description');
          }}
          touched={touched['description'] || hasTheCopyOrSaveButtonBeenClicked}
          error={errors['description']}
        />
      </TitledSection>
    );
  }
);
