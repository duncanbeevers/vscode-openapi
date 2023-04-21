import styled from "styled-components";
import { useWatch } from "react-hook-form";

import Input from "../../components/Input";
import {
  useFeatureDispatch,
  useFeatureSelector,
  testOverlordConnection,
  testScandManagerConnection,
} from "../../features/config/slice";
import { Banner, ErrorBanner } from "../../components/Banner";
import { ConnectionTestResult } from "../../../../common/src/config";
import { NormalProgressButton } from "../../components/ProgressButton";
import Select from "../../components/Select";
import ConnectionTestBanner from "./ConnectionTestBanner";
import { Container, Test, Title } from "./layout";

export default function ScanRuntime() {
  const dispatch = useFeatureDispatch();
  const {
    overlordConnectionTestResult: overlordTestResult,
    waitingForOverlordConnectionTest: waitingForOverlordTest,
    scandManagerConnectionTestResult: scandManagerTestResult,
    waitingForScandManagerConnectionTest: waitingForScandManagerTest,
  } = useFeatureSelector((state) => state.config);

  const scanRuntime = useWatch({ name: "scanRuntime" });
  const scanAuth = useWatch({ name: "scandManager.auth" });

  return (
    <>
      <Title>Runtime</Title>
      <Container>
        <Select
          label="Runtime"
          name="scanRuntime"
          options={[
            { value: "docker", label: "Docker" },
            { value: "scand-manager", label: "Scand manager" },
          ]}
        />
        {scanRuntime === "scand-manager" && (
          <>
            <Input label="Scand Manager URL" name="scandManager.url" />
            <Select
              label="Authentication method"
              name="scandManager.auth"
              options={[
                { value: "none", label: "None" },
                { value: "header", label: "HTTP Header Authentication" },
              ]}
            />
            {scanAuth === "header" && (
              <>
                <Input label="Header Name" name="scandManager.header.name" />
                <Input label="Header Value" name="scandManager.header.value" />
              </>
            )}
            <Test>
              <NormalProgressButton
                label="Test connection"
                waiting={waitingForScandManagerTest}
                onClick={(e) => {
                  dispatch(testScandManagerConnection());
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
              <ConnectionTestBanner result={scandManagerTestResult} />
            </Test>
          </>
        )}
      </Container>
    </>
  );
}
