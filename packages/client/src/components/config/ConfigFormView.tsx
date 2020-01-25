import * as React from 'react';
import { Form } from 'react-bootstrap';
import './ConfigFormView.scss';
import { CanaryMetricConfig, CanaryMetricSetQueryConfig } from '../../domain/Kayenta';
import { connect, ConnectedComponent } from '../connectedComponent';
import ConfigEditorStore from '../../stores/ConfigEditorStore';
import { observer } from 'mobx-react';
import ListStore from '../../stores/ListStore';
import { boundMethod } from 'autobind-decorator';
import { ScoringSection } from './ScoringSection';
import { NameAndDescriptionSection } from './NameAndDescriptionSection';
import { MetricsSection } from './MetricsSection';
import { RouterProps } from 'react-router';
import { metricSourceIntegrations } from '../../metricSources';
import { MetricModalProps } from './AbstractMetricModal';
import { safeGet } from '../../util/OptionalUtils';

interface Props extends RouterProps {}
interface Stores {
  configEditorStore: ConfigEditorStore;
  modalStore: ListStore<JSX.Element>;
}

@connect('configEditorStore', 'modalStore')
@observer
export default class ConfigFormView extends ConnectedComponent<Props, Stores> {
  groupEdit: any;

  constructor(props: Props) {
    super(props);
    this.groupEdit = React.createRef();
  }

  @boundMethod
  updateConfigName(value: string): void {
    this.stores.configEditorStore.updateConfigName(value);
  }

  @boundMethod
  updateConfigDescription(value: string): void {
    this.stores.configEditorStore.updateConfigDescription(value);
  }

  @boundMethod
  updateSelectedGroup(group: string): void {
    this.stores.configEditorStore.updateSelectedGroup(group);
  }

  @boundMethod
  createNewGroup(): void {
    this.stores.configEditorStore.createNewGroup();
  }

  @boundMethod
  editCurrentGroup(): void {
    this.stores.configEditorStore.toggleEditCurrentGroup();
  }

  @boundMethod
  pushModal(modal: JSX.Element): void {
    this.stores.modalStore.push(modal);
  }

  @boundMethod
  popModal(): void {
    this.stores.modalStore.pop();
  }

  @boundMethod
  updateGroupName(currentGroupName: string, newGroupName: any): void {
    this.stores.configEditorStore.updateGroupName(currentGroupName, newGroupName);
  }

  @boundMethod
  updateGroupWeight(group: string, weight: number): void {
    this.stores.configEditorStore.updateGroupWeight(group, weight);
  }

  @boundMethod
  finishEditingCurrentGroup(): void {
    this.stores.configEditorStore.toggleEditCurrentGroup();
  }

  @boundMethod
  deleteGroup(group: string): void {
    this.stores.configEditorStore.removeSyntheticGroup(group);
  }

  @boundMethod
  editMetric(metric: CanaryMetricConfig, groups: string[]): void {
    const type = (metric.query as CanaryMetricSetQueryConfig).type;
    const isQueryTypeSimple =
      safeGet(() => (metric.query as CanaryMetricSetQueryConfig).customInlineTemplate).orElse('') === '';
    const props: MetricModalProps = {
      type: type,
      groups: groups,
      existingMetric: metric,
      cancel: this.stores.modalStore.pop,
      submit: (a: CanaryMetricConfig, b: CanaryMetricConfig | undefined) => {
        this.stores.configEditorStore.createOrUpdateMetric(a, b);
        this.stores.modalStore.pop();
      },
      isQueryTypeSimple: isQueryTypeSimple
    };
    const metricModal = metricSourceIntegrations()[type].createMetricsModal(props);
    this.stores.modalStore.push(metricModal);
  }

  @boundMethod
  createOrUpdateMetric(newMetric: CanaryMetricConfig, existingMetric: CanaryMetricConfig | undefined): void {
    this.stores.configEditorStore.createOrUpdateMetric(newMetric, existingMetric);
  }

  @boundMethod
  copyMetric(metricName: string): void {
    this.stores.configEditorStore.copyMetric(metricName);
  }

  @boundMethod
  deleteMetric(metricName: string): void {
    this.stores.configEditorStore.deleteMetric(metricName);
  }

  @boundMethod
  touch(id: string): void {
    this.stores.configEditorStore.touch(id);
  }

  @boundMethod
  markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue(): void {
    this.stores.configEditorStore.markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue();
  }

  @boundMethod
  updateMetricSourceType(type: string): void {
    this.stores.configEditorStore.updateMetricSourceType(type);
  }

  render(): React.ReactNode {
    const {
      metricSourceType,
      canaryConfigObject,
      syntheticGroups: groups,
      selectedGroup,
      isEditCurGroup,
      computedGroupWeights,
      errors,
      touched,
      hasTheCopyOrSaveButtonBeenClicked,
      hasConfiguredMetrics
    } = this.stores.configEditorStore;

    return (
      <div id="canary-configuration-form-view">
        <Form>
          <NameAndDescriptionSection
            metricSourceType={metricSourceType}
            name={canaryConfigObject.name}
            description={canaryConfigObject.description}
            updateMetricSourceType={this.updateMetricSourceType}
            updateConfigName={this.updateConfigName}
            updateConfigDescription={this.updateConfigDescription}
            touch={this.touch}
            errors={errors}
            touched={touched}
            hasTheCopyOrSaveButtonBeenClicked={hasTheCopyOrSaveButtonBeenClicked}
            hasConfiguredMetrics={hasConfiguredMetrics}
          />
          <MetricsSection
            groups={groups}
            selectedGroup={selectedGroup}
            isEditCurGroup={isEditCurGroup}
            updateSelectedGroup={this.updateSelectedGroup}
            finishEditingCurrentGroup={this.finishEditingCurrentGroup}
            editCurrentGroup={this.editCurrentGroup}
            groupEdit={this.groupEdit}
            updateGroupName={this.updateGroupName}
            createNewGroup={this.createNewGroup}
            deleteGroup={this.deleteGroup}
            metrics={canaryConfigObject.metrics}
            editMetric={this.editMetric}
            copyMetric={this.copyMetric}
            deleteMetric={this.deleteMetric}
            pushModal={this.pushModal}
            popModal={this.popModal}
            createOrUpdateMetric={this.createOrUpdateMetric}
            errors={getMetricErrors(errors)}
            touched={touched['metrics'] || hasTheCopyOrSaveButtonBeenClicked}
            metricSourceType={metricSourceType}
          />
          <ScoringSection
            computedGroupWeights={computedGroupWeights}
            updateGroupWeight={this.updateGroupWeight}
            error={errors['classifier.groupWeights']}
            touched={touched['groupWeights'] || hasTheCopyOrSaveButtonBeenClicked}
          />
        </Form>
      </div>
    );
  }
}

const getMetricErrors = (errors: KvMap<string>): string[] => {
  const metricErrors: string[] = [];
  Object.keys(errors)
    .filter(id => id.startsWith('metric'))
    .forEach(id => metricErrors.push(errors[id]));
  return metricErrors;
};
