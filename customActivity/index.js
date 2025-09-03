(function () {
    let connection = null;
    let activityPayload = null;
  
    if (window.Postmonger) {
      connection = new Postmonger.Session();
      connection.on('initActivity', onInit);
      connection.on('clickedNext', onClickedNext);
      connection.trigger('ready');
    }
  
    const form = document.getElementById('learnerForm');
    const status = document.getElementById('status');
    const preview = document.getElementById('preview');
    const submitBtn = document.getElementById('submitBtn');
  
    const prev = {
      first: document.getElementById('prevFirstName'),
      last: document.getElementById('prevLastName'),
      email: document.getElementById('prevEmail'),
      state: document.getElementById('prevState'),
      time: document.getElementById('prevTime')
    };
  
    function getFormData() {
      return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        state: document.getElementById('state').value
      };
    }
  
    function validate(data) {
      return form.checkValidity();
    }
  
    function setStatus(msg) {
      status.textContent = msg || '';
    }
  
    function showPreview(data) {
      prev.first.textContent = data.firstName;
      prev.last.textContent  = data.lastName;
      prev.email.textContent = data.email;
      prev.state.textContent = data.state;
      prev.time.textContent  = `Submitted at ${new Date().toLocaleString()}`;
      preview.classList.remove('hidden');
    }
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = getFormData();
      if (!validate(data)) {
        form.reportValidity();
        return;
      }
  
      submitBtn.disabled = true;
      setStatus('Submitting…');
  
      showPreview(data);
      setStatus('Submitted successfully.');
  
      if (connection) {
        const inArgs = [{ formData: data }];
        const updated = buildActivityPayload(activityPayload, inArgs);
        connection.trigger('updateActivity', updated);
      }
  
      setTimeout(() => (submitBtn.disabled = false), 400);
    });
  
    // --- SFMC wiring
    function onInit(payload) {
      activityPayload = payload || {};
      const prevArgs = getInArguments(activityPayload);
      if (prevArgs?.formData) {
        const d = prevArgs.formData;
        document.getElementById('firstName').value = d.firstName || '';
        document.getElementById('lastName').value  = d.lastName || '';
        document.getElementById('email').value     = d.email || '';
        document.getElementById('state').value     = d.state || '';
      }
      markConfigured(true);
    }
  
    function onClickedNext() {
      const data = getFormData();
      if (!validate(data)) {
        setStatus('Please fill in all required fields.');
        if (connection) connection.trigger('ready');
        return;
      }
      const inArgs = [{ formData: data }];
      const updated = buildActivityPayload(activityPayload, inArgs);
      if (connection) connection.trigger('updateActivity', updated);
    }
  
    function markConfigured(isConfigured) {
      if (!activityPayload) activityPayload = {};
      activityPayload.metaData = activityPayload.metaData || {};
      activityPayload.metaData.isConfigured = !!isConfigured;
      if (connection) connection.trigger('updateActivity', activityPayload);
    }
  
    function getInArguments(payload) {
      try {
        const arr = payload?.arguments?.execute?.inArguments;
        if (Array.isArray(arr) && arr.length) {
          return arr.reduce((acc, item) => Object.assign(acc, item), {});
        }
      } catch {}
      return null;
    }
  
    function buildActivityPayload(base, inArguments) {
      const p = JSON.parse(JSON.stringify(base || {}));
      p.arguments = p.arguments || {};
      p.arguments.execute = p.arguments.execute || {};
      p.arguments.execute.inArguments = inArguments || [];
      p.metaData = p.metaData || {};
      p.metaData.isConfigured = true;
      return p;
    }
  })();
  