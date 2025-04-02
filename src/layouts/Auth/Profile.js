import React from 'react';
import Layout from "../pages/layout";

const Profile = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-box">
        <div className="row align-items-center">
          <div className="col-auto">
            <h4 className="page-title">Profile</h4>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="#">Contacts</a></li>
              <li className="breadcrumb-item active">Profile</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-xl-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-center">
                <div className="dropdown float-end">
                  <a className="text-body dropdown-toggle font-size-18" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                    <i className="uil uil-ellipsis-v"></i>
                  </a>

                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item" href="#">Edit</a>
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Remove</a>
                  </div>
                </div>
                <div className="clearfix"></div>
                <div>
                  <img src="/assets/images/users/avatar-4.jpg" alt="" className="avatar-lg rounded-circle img-thumbnail" />
                </div>
                <h5 className="mt-3 mb-1">Marcus</h5>
                <p className="text-muted">UI/UX Designer</p>

                <div className="mt-4">
                  <button type="button" className="btn btn-light btn-sm"><i className="uil uil-envelope-alt me-2"></i> Message</button>
                </div>
              </div>

              <hr className="my-4" />

              <div className="text-muted">
                <h5 className="font-size-16">About</h5>
                <p>Hi I'm Marcus,has been the industry's standard dummy text To an English person, it will seem like simplified English, as a skeptical Cambridge.</p>
                <div className="table-responsive mt-4">
                  <div>
                    <p className="mb-1">Name :</p>
                    <h5 className="font-size-16">Marcus</h5>
                  </div>
                  <div className="mt-4">
                    <p className="mb-1">Mobile :</p>
                    <h5 className="font-size-16">012-234-5678</h5>
                  </div>
                  <div className="mt-4">
                    <p className="mb-1">Email :</p>
                    <h5 className="font-size-16">marcus@minible.com</h5>
                  </div>
                  <div className="mt-4">
                    <p className="mb-1">Location :</p>
                    <h5 className="font-size-16">California, United States</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card mb-0">
            {/* Nav tabs */}
            <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" data-bs-toggle="tab" href="#about" role="tab">
                  <i className="uil uil-user-circle font-size-20"></i>
                  <span className="d-none d-sm-block">About</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#tasks" role="tab">
                  <i className="uil uil-clipboard-notes font-size-20"></i>
                  <span className="d-none d-sm-block">Tasks</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#messages" role="tab">
                  <i className="uil uil-envelope-alt font-size-20"></i>
                  <span className="d-none d-sm-block">Messages</span>
                </a>
              </li>
            </ul>
            
            {/* Tab content */}
            <div className="tab-content p-4">
              <div className="tab-pane active" id="about" role="tabpanel">
                <div>
                  <div>
                    <h5 className="font-size-16 mb-4">Experience</h5>

                    <ul className="activity-feed mb-0 ps-2">
                      <li className="feed-item">
                        <div className="feed-item-list">
                          <p className="text-muted mb-1">2019 - 2020</p>
                          <h5 className="font-size-16">UI/UX Designer</h5>
                          <p>Abc Company</p>
                          <p className="text-muted">To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words. If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual</p>
                        </div>
                      </li>
                      <li className="feed-item">
                        <div className="feed-item-list">
                          <p className="text-muted mb-1">2017 - 2019</p>
                          <h5 className="font-size-16">Graphic Designer</h5>
                          <p>xyz Company</p>
                          <p className="text-muted">It will be as simple as occidental in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-size-16 mb-4">Projects</h5>

                    <div className="table-responsive">
                      <table className="table table-nowrap table-hover mb-0">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Projects</th>
                            <th scope="col">Date</th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{width: '120px'}}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">01</th>
                            <td><a href="#" className="text-reset">Brand Logo Design</a></td>
                            <td>18 Jun, 2020</td>
                            <td>
                              <span className="badge bg-primary-subtle text-primary font-size-12">Open</span>
                            </td>
                            <td>
                              <div className="dropdown">
                                <a className="text-muted dropdown-toggle font-size-18 px-2" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                  <i className="uil uil-ellipsis-v"></i>
                                </a>

                                <div className="dropdown-menu dropdown-menu-end">
                                  <a className="dropdown-item" href="#">Action</a>
                                  <a className="dropdown-item" href="#">Another action</a>
                                  <a className="dropdown-item" href="#">Something else here</a>
                                </div>
                              </div>
                            </td>
                          </tr>
                          {/* More table rows... */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="tab-pane" id="tasks" role="tabpanel">
                {/* Tasks content... */}
              </div>
              
              <div className="tab-pane" id="messages" role="tabpanel">
                {/* Messages content... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;