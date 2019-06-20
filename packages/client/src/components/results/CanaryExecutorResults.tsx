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

@connect(
  'canaryExecutorStore',
  'resultsStore'
)
@observer
export default class CanaryExecutorResults extends ConnectedComponent<Props, Stores> {
  async componentDidMount(): Promise<void> {
    log.info(this.stores.resultsStore.canaryExecutionId);
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
        log.info(this.stores.resultsStore.canaryExecutionId);
        response = await kayentaApiService.fetchCanaryRunStatusAndResults(this.stores.resultsStore.canaryExecutionId);
        log.info(response.stageStatus);

        this.stores.resultsStore.updateStageStatus(response.stageStatus);
      };
      await data();
    } while (!response.complete);

    log.info(this.stores.resultsStore.canaryExecutionId);
    this.stores.resultsStore.updateResultsRequestComplete();
    this.stores.resultsStore.updateCanaryExecutionStatusResponse(response);
    this.props.history.push('/dev-tools/canary-executor/results/' + this.stores.resultsStore.canaryExecutionId);
  }

  render(): React.ReactNode {
    const { canaryExecutorStore, resultsStore } = this.stores;

    return (
      <div className="canary-executor-results">
        {resultsStore.resultsRequestComplete ? (
          <div>
            <TitledSection title="Canary Results" />

            <div className="widget">
              <div className="standalone-canary-analysis-summary">
                <div className="summary-container  ">
                  <div className="metadata-container">
                    <div className="result-container">
                      <div className="result-label headline-md-base">Passed Thresholds</div>
                      <div className="result-value-container">
                        <div className="result-value headline-md-brand">
                          {resultsStore.canaryExecutionStatusResponse.result.judgeResult.score.classification === 'Pass'
                            ? 'Yes'
                            : 'No'}
                        </div>
                      </div>
                    </div>

                    <div className="score-container">
                      <div className="score-label headline-md-base">Canary Score</div>
                      <div className="score-value headline-md-brand">
                        {resultsStore.canaryExecutionStatusResponse.result.judgeResult.score.score}
                      </div>
                    </div>

                    <div className="mode-container">
                      <div className="mode-label headline-md-base">Testing Type</div>
                      <div className="mode-value headline-md-brand">
                        {canaryExecutorStore.testingType === 'AA' ? 'A-A' : 'A-B'}
                      </div>
                    </div>
                  </div>
                  <Meter />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h5>Loading</h5>
            <ClipLoader />
          </div>
        )}
      </div>
    );
  }
}

const Meter = (): JSX.Element => {
  let meterStyle = {
    width: `${DEFAULT_CANARY_SCORE_DISPLAY}%`
  };
  if (response.result.judgeResult.score.score > 0) {
    meterStyle = {
      width: `${response.result.judgeResult.score.score}%`
    };
  }

  const marginalLineStyle = {
    left: `${response.canaryExecutionRequest.thresholds.marginal}%`
  };
  const passLineStyle = {
    left: `${response.canaryExecutionRequest.thresholds.pass}%`
  };

  return (
    <div className="meter-wrapper">
      <div
        className={['meter', response.result.judgeResult.score.classification === 'Pass' ? 'pass' : 'fail'].join(' ')}
        style={meterStyle}
      />
      <div className="marginal-line" style={marginalLineStyle}>
        <div className="threshold-label headline-md-base">{response.canaryExecutionRequest.thresholds.marginal}</div>
      </div>
      <div className="pass-line" style={passLineStyle}>
        <div className="threshold-label headline-md-base">{response.canaryExecutionRequest.thresholds.pass}</div>
      </div>
    </div>
  );
};
