
import React from "react";
import LandingFooter from "./LandingComponent/Footer";
import LandingHeaderComponent from "./LandingComponent/LandingHeaders";

const SafetyPolicy = () => {
  return (
    <div>
      <LandingHeaderComponent />

      <div className="inner-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 privacy-policy">
              <h3>Learning more about our Child Safety Standards policy:</h3>
              <div>
                <p>
                  Google Play takes seriously the safety of children on our
                  platform and is committed to working to keep our store free of
                  child sexual abuse and exploitation. We require apps in the
                  Social and Dating categories to comply with our Child Safety
                  Standards policy.
                </p>
              </div>
              <div>
                <h5>Overview</h5>
                <p>The Child Safety Standards policy requires apps to:</p>
                 <ul>
                 
    <li>Have published standards against child sexual abuse and exploitation (CSAE);</li>
    <li>Provide an in-app mechanism for user feedback;</li>
   <li> Address child sexual abuse material (CSAM);</li>
    <li>Comply with child safety laws;</li> 
    <li>Provide a child safety point of contact</li>.

                 </ul>
                <p>
                  Make sure to read the policy in full and ensure you understand
                  and comply. Developers who are not in compliance by the
                  deadline may be subject to enforcement actions. For more
                  guidance, check out Tech Coalition’s best practices for
                  Combating Online CSEA:
                </p>
              </div>
              <div>
                <h5>Timeline information</h5>
                <p>
                  We anticipate the following timeline for rollout of the Child
                  Safety Standards policy. Note that this is subject to change;
                  updates will be posted in this article.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default SafetyPolicy;

