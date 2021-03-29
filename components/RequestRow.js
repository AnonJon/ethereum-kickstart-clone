import React, { useState } from "react";
import { Table, Button, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

const RequestRow = (props) => {
  const [loading, setLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { request, id, approversCount } = props;
  const readyToFinalize = request.approvalCount > approversCount / 2;

  const onApprove = async () => {
    const campaign = Campaign(props.address);
    const accounts = await web3.eth.getAccounts();
    setLoading(true);
    try {
      setErrorMessage("");
      await campaign.methods
        .approveRequest(props.id)
        .send({ from: accounts[0] });
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  const onFinalize = async () => {
    if (!readyToFinalize) {
      setErrorMessage("Not a high enough approval count");
    } else {
      setErrorMessage("");
      const campaign = Campaign(props.address);
      const accounts = await web3.eth.getAccounts();
      setFinalizeLoading(true);
      try {
        await campaign.methods
          .finalizeRequest(props.id)
          .send({ from: accounts[0] });
      } catch (err) {
        setErrorMessage(err.message);
      }
      setFinalizeLoading(false);
    }
  };

  return (
    <Table.Row
      disabled={request.complete}
      positive={!!readyToFinalize && !request.complete}
    >
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(request.value, "ether")}</Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>
        {request.approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell>
        {request.complete ? null : (
          <Button color="green" loading={loading} basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {request.complete ? null : (
          <Button
            color="teal"
            loading={finalizeLoading}
            basic
            onClick={onFinalize}
          >
            Finalize
          </Button>
        )}
      </Table.Cell>
      {errorMessage ? (
        <Message error header="Oops!" content={errorMessage} />
      ) : null}
    </Table.Row>
  );
};

export default RequestRow;
