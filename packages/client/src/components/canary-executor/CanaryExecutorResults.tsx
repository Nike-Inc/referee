import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import CanaryExecutorStore from '../../stores/CanaryExecutorStore';
import { connect, ConnectedComponent } from '../connectedComponent';
import { observer } from 'mobx-react';
import CanaryExecutorFormView from './CanaryExecutorFormView';
import ConfigFormView from '../config/ConfigFormView';
import { fetchCanaryResultsService } from '../../services';
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import TitledSection from '../../layout/titledSection';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';

import CanaryExecutorResultsRunAgainButton from './CanaryExecutorResultsRunAgainButton';
import ConfigEditorStore from '../../stores/ConfigEditorStore';
import './CanaryExecutorResults.scss';
import { Button } from 'react-bootstrap';
import { Meter } from '../shared/Meter';

interface Stores {
  configEditorStore: ConfigEditorStore;
  canaryExecutorStore: CanaryExecutorStore;
}

interface ResultsPathParams {
  canaryExecutionId: string;
}

interface Props extends RouteComponentProps<ResultsPathParams> {}

const TERMINAL = 'Terminal';
const TERMINAL_SCORE = 0;

@connect(
  'configEditorStore',
  'canaryExecutorStore'
)
@observer
export default class CanaryExecutorResults extends ConnectedComponent<Props, Stores> {
  async componentDidMount(): Promise<void> {
    fetchCanaryResultsService.pollForCanaryExecutionComplete(this.props.match.params.canaryExecutionId);
    this.stores.canaryExecutorStore.resetIsAccordionExpanded();
  }

  render(): React.ReactNode {
    const { canaryExecutorStore } = this.stores;

    return (
      <div className="canary-executor-results">
        {!canaryExecutorStore.resultsRequestComplete ? (
          <div>
            <h5>Loading</h5>
            <ClipLoader />
          </div>
        ) : (
          <div>
            <TitledSection title="Canary Results" />
            <div className="canary-results-metadata">
              <div className="widget">
                <Summary
                  classification={
                    canaryExecutorStore.canaryExecutionStatusResponse
                      ? canaryExecutorStore.canaryExecutionStatusResponse!.result!.judgeResult!.score.classification // <- TODO is this safe?
                      : TERMINAL
                  }
                  score={
                    canaryExecutorStore.canaryExecutionStatusResponse
                      ? canaryExecutorStore.canaryExecutionStatusResponse!.result!.judgeResult!.score.score // <- TODO is this safe?
                      : TERMINAL_SCORE
                  }
                  testingType={canaryExecutorStore.testingType}
                  marginal={canaryExecutorStore.canaryExecutionRequestObject.thresholds.marginal}
                  pass={canaryExecutorStore.canaryExecutionRequestObject.thresholds.pass}
                />
              </div>
              <div className="btn-wrapper">
                <Button
                  onClick={() => {
                    this.props.history.push('/reports/canary/' + this.stores.canaryExecutorStore.canaryExecutionId);
                  }}
                  variant="dark"
                >
                  View Report
                </Button>
              </div>
            </div>
            <Accordion
              allowZeroExpanded={true}
              onChange={() => {
                canaryExecutorStore.toggleIsAccordionExpanded();
              }}
            >
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className="row-component">
                      {canaryExecutorStore.isAccordionExpanded ? (
                        <FontAwesomeIcon className="chevron" size="lg" color="white" icon={faChevronDown} />
                      ) : (
                        <FontAwesomeIcon className="chevron" size="lg" color="white" icon={faChevronRight} />
                      )}
                      <div className="row-item">
                        <TitledSection title="Edit Configuration" />
                      </div>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <ConfigFormView history={this.props.history} />
                  <CanaryExecutorFormView />
                  <CanaryExecutorResultsRunAgainButton history={this.props.history} />
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    );
  }
}

const Summary = ({
  classification,
  score,
  testingType,
  marginal,
  pass
}: {
  classification: string;
  score: number;
  testingType: string;
  marginal: number;
  pass: number;
}): JSX.Element => {
  return (
    <div className="summary-container">
      <div className="metadata-container">
        <div className="result-container">
          <div className="result-label headline-md-base">Passed Thresholds</div>
          <div className="result-value-container">
            <div className="result-value headline-md-brand">
              {classification === TERMINAL ? 'Terminal' : classification === 'Pass' ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
        <div className="score-container">
          <div className="score-label headline-md-base">Canary Score</div>
          <div className="score-value headline-md-brand">{score}</div>
        </div>
        <div className="mode-container">
          <div className="mode-label headline-md-base">Testing Type</div>
          <div className="mode-value headline-md-brand">{testingType === 'AA' ? 'A-A' : 'A-B'}</div>
        </div>
      </div>
      <div className="meter-container">
        <Meter classification={classification} score={score} marginal={marginal} pass={pass} />
      </div>
    </div>
  );
};
