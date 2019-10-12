import React from "react";

import { shallow } from "enzyme";

import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import {
  SilenceFormStore,
  SilenceFormStage,
  SilenceTabNames
} from "Stores/SilenceFormStore";
import { SilenceModalContent } from "./SilenceModalContent";

let alertStore;
let settingsStore;
let silenceFormStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings();
  silenceFormStore = new SilenceFormStore();

  silenceFormStore.tab.current = SilenceTabNames.Editor;
});

const MockOnHide = jest.fn();

const ShallowSilenceModalContent = () => {
  return shallow(
    <SilenceModalContent
      alertStore={alertStore}
      settingsStore={settingsStore}
      silenceFormStore={silenceFormStore}
      onHide={MockOnHide}
    />
  );
};

describe("<SilenceModalContent />", () => {
  it("Clicking on the Browser tab changes content", () => {
    const tree = ShallowSilenceModalContent();
    const tabs = tree.find("Tab");
    tabs.at(1).simulate("click");
    const form = tree.find("Browser");
    expect(form).toHaveLength(1);
  });

  it("Clicking on the Editor tab changes content", () => {
    silenceFormStore.tab.current = SilenceTabNames.Browser;
    const tree = ShallowSilenceModalContent();
    const tabs = tree.find("Tab");
    tabs.at(0).simulate("click");
    const form = tree.find("SilenceForm");
    expect(form).toHaveLength(1);
  });

  it("Content is not blurred when silenceFormStore.toggle.blurred is false", () => {
    silenceFormStore.toggle.blurred = false;
    const tree = ShallowSilenceModalContent();
    expect(tree.find("div.modal-body.modal-content-blur")).toHaveLength(0);
  });

  it("Content is blurred when silenceFormStore.toggle.blurred is true", () => {
    silenceFormStore.toggle.blurred = true;
    const tree = ShallowSilenceModalContent();
    expect(tree.find("div.modal-body.modal-content-blur")).toHaveLength(1);
  });
});

describe("<SilenceModalContent /> Editor", () => {
  it("title is 'New silence' when creating new silence", () => {
    silenceFormStore.data.currentStage = SilenceFormStage.UserInput;
    silenceFormStore.data.silenceID = null;
    const tree = ShallowSilenceModalContent();
    const tab = tree.find("Tab").at(0);
    expect(tab.props().title).toBe("New silence");
  });
  it("title is 'Editing silence' when editing exiting silence", () => {
    silenceFormStore.data.currentStage = SilenceFormStage.UserInput;
    silenceFormStore.data.silenceID = "1234";
    const tree = ShallowSilenceModalContent();
    const tab = tree.find("Tab").at(0);
    expect(tab.props().title).toBe("Editing silence");
  });
  it("title is 'Preview silenced alerts' when previewing silenced alerts", () => {
    silenceFormStore.data.currentStage = SilenceFormStage.Preview;
    silenceFormStore.data.silenceID = "1234";
    const tree = ShallowSilenceModalContent();
    const tab = tree.find("Tab").at(0);
    expect(tab.props().title).toBe("Preview silenced alerts");
  });
  it("title is 'Silence submitted' after sending silence to Alertmanager", () => {
    silenceFormStore.data.currentStage = SilenceFormStage.Submit;
    silenceFormStore.data.silenceID = "1234";
    const tree = ShallowSilenceModalContent();
    const tab = tree.find("Tab").at(0);
    expect(tab.props().title).toBe("Silence submitted");
  });

  it("renders SilenceForm when silenceFormStore.data.currentStage is 'UserInput'", () => {
    silenceFormStore.data.currentStage = SilenceFormStage.UserInput;
    const tree = ShallowSilenceModalContent();
    const form = tree.find("SilenceForm");
    expect(form).toHaveLength(1);
  });

  it("renders SilencePreview when silenceFormStore.data.currentStage is 'Preview'", () => {
    silenceFormStore.data.currentStage = SilenceFormStage.Preview;
    const tree = ShallowSilenceModalContent();
    const ctrl = tree.find("SilencePreview");
    expect(ctrl).toHaveLength(1);
  });

  it("renders SilenceSubmitController when silenceFormStore.data.currentStage is 'Submit'", () => {
    silenceFormStore.data.currentStage = SilenceFormStage.Submit;
    const tree = ShallowSilenceModalContent();
    const ctrl = tree.find("SilenceSubmitController");
    expect(ctrl).toHaveLength(1);
  });
});

describe("<SilenceModalContent /> Browser", () => {
  it("renders silence browser when tab is set to Browser", () => {
    silenceFormStore.tab.current = SilenceTabNames.Browser;
    const tree = ShallowSilenceModalContent();
    const form = tree.find("Browser");
    expect(form).toHaveLength(1);
  });
});
