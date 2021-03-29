import React, { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContributeForm = (props) => {
  const [contribution, setContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (contribution < web3.utils.fromWei(props.minContrib, "ether")) {
      setErrorMessage("Contribution is too low");
    } else {
      const campaign = Campaign(props.address);
      setLoading(true);
      setErrorMessage("");

      try {
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei(contribution, "ether"),
        });
        Router.replaceRoute(`/campaigns/${props.address}`);
      } catch (err) {
        setErrorMessage(err.message);
      }
      setLoading(false);
      setContribution("");
    }
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ETH"
          labelPosition="right"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button loading={loading} primary type="submit">
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
