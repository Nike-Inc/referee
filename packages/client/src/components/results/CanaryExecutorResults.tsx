import * as React from 'react';
import { Button } from 'react-bootstrap';
import { RouterProps } from 'react-router';
import CanaryExecutorStore from '../../stores/CanaryExecutorStore';
import { connect, ConnectedComponent } from '../connectedComponent';
import { observer } from 'mobx-react';
import CanaryExecutorResultsStore from '../../stores/CanaryExecutorResultsStore';
import CanaryExecutorFormView from '../canary-executor/CanaryExecutorFormView';
import ConfigFormView from '../config/ConfigFormView';
import log from '../../util/LoggerFactory';
import { kayentaApiService } from '../../services';
import { CanaryExecutionStatusResponse } from '../../domain/CanaryExecutionStatusResponse';
import { delay } from 'q';
import { ClipLoader } from 'react-spinners';
import TitledSection from '../../layout/titledSection';
import CanaryExecutorButtonSection from '../canary-executor/CanaryExecutorButtonSection';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';
import './CanaryExecutorResults.scss';

interface Stores {
  canaryExecutorStore: CanaryExecutorStore;
  resultsStore: CanaryExecutorResultsStore;
}

interface Props extends RouterProps {}

let response: CanaryExecutionStatusResponse | any = {};
const DEFAULT_CANARY_SCORE_DISPLAY = '1';
const SUCCESS = 'succeeded';
const TERMINAL = 'Terminal';
const TERMINAL_SCORE = 0;

@connect(
  'canaryExecutorStore',
  'resultsStore'
)
@observer
export default class CanaryExecutorResults extends ConnectedComponent<Props, Stores> {
  async componentDidMount(): Promise<void> {
    if (this.stores.resultsStore.canaryExecutionId === '') {
      const path = window.location.pathname;
      const queryId = path.split('/').pop();

      if (queryId !== undefined) {
        this.stores.resultsStore.setCanaryExecutionId(queryId);
      }
    }

    do {
      const data = async () => {
        await delay(1000);
        response = await kayentaApiService.fetchCanaryRunStatusAndResults(this.stores.resultsStore.canaryExecutionId);
        this.stores.resultsStore.updateStageStatus(response.stageStatus);
      };
      await data();
    } while (!response.complete);

    if (response.status === SUCCESS) {
      this.stores.resultsStore.updateCanaryExecutionStatusResponse(response);
    }

    this.stores.resultsStore.updateResultsRequestComplete();
    this.props.history.push('/dev-tools/canary-executor/results/' + this.stores.resultsStore.canaryExecutionId);
  }

  render(): React.ReactNode {
    const { canaryExecutorStore, resultsStore } = this.stores;

    return (
      <div className="canary-executor-results">
        {!resultsStore.resultsRequestComplete ? (
          <div>
            <h5>Loading</h5>
            <ClipLoader />
          </div>
        ) : (
          <div>
            <TitledSection title="Canary Results" />
            <div className="widget">
              <div className="standalone-canary-analysis-summary">
                <Summary
                  classification={
                    resultsStore.canaryExecutionStatusResponse
                      ? resultsStore.canaryExecutionStatusResponse.result.judgeResult.score.classification
                      : TERMINAL
                  }
                  score={
                    resultsStore.canaryExecutionStatusResponse
                      ? resultsStore.canaryExecutionStatusResponse.result.judgeResult.score.score
                      : TERMINAL_SCORE
                  }
                  testingType={canaryExecutorStore.testingType}
                  marginal={canaryExecutorStore.canaryExecutionRequestObject.thresholds.marginal}
                  pass={canaryExecutorStore.canaryExecutionRequestObject.thresholds.pass}
                />
              </div>
            </div>
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
  let meterStyle = {
    width: `${DEFAULT_CANARY_SCORE_DISPLAY}%`
  };
  if (score > 0) {
    meterStyle = {
      width: `${score}%`
    };
  }

  const marginalLineStyle = {
    left: `${marginal}%`
  };
  const passLineStyle = {
    left: `${pass}%`
  };

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
      <div className="meter-wrapper">
        <div className={['meter', classification === 'Pass' ? 'pass' : 'fail'].join(' ')} style={meterStyle} />
        <div className="marginal-line" style={marginalLineStyle}>
          <div className="threshold-label headline-md-base">{marginal}</div>
        </div>
        <div className="pass-line" style={passLineStyle}>
          <div className="threshold-label headline-md-base">{pass}</div>
        </div>
      </div>
    </div>
  );
};
