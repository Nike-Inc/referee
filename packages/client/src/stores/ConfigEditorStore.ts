import { observable, action, computed } from 'mobx';
import { CanaryConfig, CanaryMetricConfig, GroupWeights } from '../domain/Kayenta';
import CanaryConfigFactory from '../util/CanaryConfigFactory';
import log from '../util/LoggerFactory';
import { validateCanaryConfig } from '../validation/configValidators';
import { metricSourceTypes } from '../metricSources';
import { safeGet } from '../util/OptionalUtils';

/**
 * Mobx store for the configuration editor component
 */
export default class ConfigEditorStore {
  @observable
  metricSourceType: string = metricSourceTypes()[0];

  @observable
  canaryConfigObject: CanaryConfig = CanaryConfigFactory.createNewCanaryConfig();

  @observable
  syntheticGroups: string[] = ['all'];

  @observable
  selectedGroup: string = 'all';

  @observable
  isEditCurGroup: boolean = false;

  @observable
  touched: KvMap<boolean> = {};

  @observable
  hasTheCopyOrSaveButtonBeenClicked = false;

  /**
   * Computes the groups from metrics, excluding synthetic groups that are not associated with real metrics.
   */
  @computed
  get computedGroupWeights(): GroupWeights {
    const groupWeights: GroupWeights = {};
    const uniqueGroups = new Set();
    if (this.canaryConfigObject && Array.isArray(this.canaryConfigObject.metrics)) {
      this.canaryConfigObject.metrics.forEach(metric => {
        metric.groups.forEach(group => {
          uniqueGroups.add(group);
        });
      });
    }

    Array.from(uniqueGroups).forEach(group => {
      if (
        this.canaryConfigObject &&
        this.canaryConfigObject.classifier &&
        typeof this.canaryConfigObject.classifier.groupWeights === 'object'
      ) {
        groupWeights[group] = this.canaryConfigObject.classifier.groupWeights[group]
          ? this.canaryConfigObject.classifier.groupWeights[group]
          : 0;
      } else {
        groupWeights[group] = 0;
      }
    });

    return groupWeights;
  }

  @computed
  get metricGroupNamesDescByWeight(): string[] {
    const groupWeights = this.canaryConfigObject.classifier.groupWeights;

    const metricGroupNamesDescByWeight = Object.keys(groupWeights).sort((a, b) => {
      return groupWeights[b] - groupWeights[a];
    });

    return metricGroupNamesDescByWeight;
  }

  @computed
  get errors(): KvMap<string> {
    return validateCanaryConfig(this.canaryConfigObject).errors;
  }

  @computed
  get isCanaryConfigValid(): boolean {
    return validateCanaryConfig(this.canaryConfigObject).isValid;
  }

  @computed
  get hasConfiguredMetrics(): boolean {
    return safeGet(() => this.canaryConfigObject.metrics.length).orElse(0) > 0;
  }

  @action.bound
  updateMetricSourceType(type: string): void {
    this.metricSourceType = type;
  }

  @action.bound
  setCanaryConfigObject(canaryConfigObject: CanaryConfig): void {
    if (canaryConfigObject.metrics == null) {
      this.canaryConfigObject = canaryConfigObject.canaryConfig
    } else {
      this.canaryConfigObject = canaryConfigObject;
    }
    this.canaryConfigObject.metrics.forEach(metric => metric.groups.forEach(g => this.createNewGroup(g, false)));
    this.hasTheCopyOrSaveButtonBeenClicked = false;
    const uniqueGroups = new Set();
    if (this.canaryConfigObject && Array.isArray(this.canaryConfigObject.metrics)) {
      this.canaryConfigObject.metrics.forEach(metric => {
        const queryStrippedSlashes = JSON.stringify(metric.query).replace(/\$\\\\/g, '$');
        metric.query = JSON.parse(queryStrippedSlashes);
        metric.groups.forEach(group => {
          uniqueGroups.add(group);
        });
      });
    }

    Object.keys(this.canaryConfigObject.classifier.groupWeights)
      .filter(key => !uniqueGroups.has(key))
      .forEach(keyToDelete => delete this.canaryConfigObject.classifier.groupWeights[keyToDelete]);

    this.metricSourceType = safeGet(() => this.canaryConfigObject.metrics[0].query.type).orElse(metricSourceTypes()[0]);
  }

  @action.bound
  updateConfigName(value: string): void {
    this.canaryConfigObject.name = value;
  }

  @action.bound
  updateConfigDescription(value: string): void {
    this.canaryConfigObject.description = value;
  }

  @action.bound
  removeSyntheticGroup(groupToRemove: string): void {
    if (this.canaryConfigObject.metrics.filter(m => m.groups.includes(groupToRemove)).length > 0) {
      log.error('cannot delete a group that is still associated with metrics');
      return;
    }
    this.syntheticGroups = this.syntheticGroups.filter(group => group !== groupToRemove);
    this.selectedGroup = 'all';
  }

  @action.bound
  createOrUpdateMetric(newMetric: CanaryMetricConfig, existingMetric: CanaryMetricConfig | undefined): void {
    const newMetrics = this.canaryConfigObject.metrics
      .slice()
      .filter(metric => metric.name !== (existingMetric ? existingMetric.name : undefined));
    newMetrics.push(newMetric);
    newMetrics.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    this.canaryConfigObject.metrics = newMetrics;

    // Add any new groups that where created in the metric form
    newMetric.groups.forEach(group => {
      if (!this.syntheticGroups.includes(group)) {
        this.createNewGroup(group, false);
      }
    });
  }

  @action.bound
  updateSelectedGroup(group: string): void {
    this.selectedGroup = group;
  }

  @action.bound
  createNewGroup(name?: string, updateSelectedGroup: boolean = true): void {
    let newGroupName: string;
    if (!name) {
      let i = 1;
      do {
        newGroupName = `group ${i}`;
        i = i + 1;
      } while (this.syntheticGroups.filter(group => group === newGroupName).length > 0);
    } else {
      newGroupName = name;
      if (this.syntheticGroups.includes(name)) {
        return;
      }
    }
    let newGroups = this.syntheticGroups.slice();
    newGroups.push(newGroupName);
    newGroups = newGroups.slice(1, newGroups.length).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    newGroups.unshift('all');

    this.syntheticGroups = newGroups;

    if (updateSelectedGroup) {
      this.selectedGroup = newGroupName;
    }
  }

  @action.bound
  toggleEditCurrentGroup(): void {
    this.isEditCurGroup = !this.isEditCurGroup;
  }

  @action.bound
  updateGroupName(currentGroupName: string, newGroupName: string): void {
    if (newGroupName === currentGroupName) {
      return;
    }

    // if the group already exists bail out.
    if (this.syntheticGroups.filter(group => group === newGroupName).length > 0) {
      log.error('The group already exists', newGroupName);
      return;
    }

    let newGroups: string[] = [];
    this.syntheticGroups.forEach(group => {
      if (group !== currentGroupName) {
        newGroups.push(group);
      } else {
        newGroups.push(newGroupName);
      }
    });
    newGroups = newGroups.slice(1, newGroups.length).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    newGroups.unshift('all');

    // collect and update metrics group references as needed
    const newMetrics: CanaryMetricConfig[] = this.canaryConfigObject.metrics.slice().map(metric => {
      for (let i = 0; i < metric.groups.length; i++) {
        if (metric.groups[i] === currentGroupName) {
          metric.groups[i] = newGroupName;
        }
      }
      return metric;
    });

    const curScore = this.canaryConfigObject.classifier.groupWeights[currentGroupName];
    delete this.canaryConfigObject.classifier.groupWeights[currentGroupName];
    this.canaryConfigObject.classifier.groupWeights[newGroupName] = curScore;

    this.syntheticGroups = newGroups;
    this.selectedGroup = newGroupName;
    this.canaryConfigObject.metrics = newMetrics;
    this.isEditCurGroup = false;
  }

  @action.bound
  updateGroupWeight(group: string, weight: number): void {
    this.canaryConfigObject.classifier.groupWeights[group] = weight;
  }

  @action.bound
  copyMetric(metricName: string): void {
    const newMetrics: CanaryMetricConfig[] = this.canaryConfigObject.metrics.slice();
    const metricToCopyArray = this.canaryConfigObject.metrics.filter(metric => metric.name === metricName);

    // todo error notification
    if (metricToCopyArray.length !== 1) {
      return;
    }
    const metricToCopy = metricToCopyArray[0];

    // find a application that is unique
    let newMetricName: string;
    let i = 1;
    do {
      if (/^.*?-copy-\d+$/.test(metricName)) {
        newMetricName = `${metricToCopy.name.replace(/\d+$/, `${i}`)}`;
      } else {
        newMetricName = `${metricToCopy.name}-copy-${i}`;
      }
      i = i + 1;
    } while (this.canaryConfigObject.metrics.filter(metric => metric.name === newMetricName).length > 0);
    const newMetric = Object.assign({}, metricToCopy, { name: newMetricName });
    newMetrics.push(newMetric);

    this.canaryConfigObject.metrics = newMetrics;
  }

  @action.bound
  deleteMetric(metricName: string): void {
    this.canaryConfigObject.metrics = this.canaryConfigObject.metrics.filter(metric => metric.name !== metricName);
  }

  @action.bound
  touch(id: string): void {
    this.touched[id] = true;
  }

  @action.bound
  markHasTheCopyOrSaveButtonBeenClickedFlagAsTrue(): void {
    this.hasTheCopyOrSaveButtonBeenClicked = true;
  }
}
