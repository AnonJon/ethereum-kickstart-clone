import React from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

const CampaignShow = (props) => {
  const renderCards = () => {
    const {
      minimumContribution,
      balance,
      requestCount,
      approversCount,
      manager,
    } = props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The Manager who created this campaign. Only the manager can create requests to withdraw money.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: `${minimumContribution} (${web3.utils.fromWei(
          minimumContribution
        )}ETH)`,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute more than this much to become an approver",
      },
      {
        header: requestCount,
        meta: "Number of requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers( or contributers)",
      },
      {
        header: approversCount,
        meta: "Number of contributers",
        description:
          "Number of people who have already donated to this campaign.",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ETH)",
        description: "Current fund total.",
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h1>Campaign Details</h1>
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={9}>{renderCards()}</Grid.Column>
            <Grid.Column mobile={5}>
              <ContributeForm
                address={props.address}
                minContrib={props.minimumContribution}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.address);
  const summary = await campaign.methods.getSummary().call();
  return {
    address: props.query.address,
    minimumContribution: summary[0],
    balance: summary[1],
    requestCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
};

export default CampaignShow;
