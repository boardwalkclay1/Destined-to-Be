<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Destined to Be – Numerology Portal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="styles.css">

  <!-- Socket.IO client -->
  <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"
          integrity="sha384-mGQJfoTqG91d9s0PCMsoKn5aIJL3tYDIymKvGJTd6RFK5g7ImS1xM63tZAkR0q8p"
          crossorigin="anonymous"></script>
</head>
<body>
  <div id="app">
    <!-- Auth -->
    <section id="screen-auth" class="screen">
      <div class="auth-card">
        <h1>Destined to Be</h1>
        <p class="subtitle">Midnight numerology with a live Spirit Guide.</p>

        <div id="auth-toggle">
          <button id="btn-show-login" class="tab active">Login</button>
          <button id="btn-show-signup" class="tab">Sign up</button>
        </div>

        <form id="form-login" class="auth-form">
          <label>Username
            <input type="text" id="login-username" autocomplete="username">
          </label>
          <label>PIN / Password
            <input type="password" id="login-password" autocomplete="current-password">
          </label>
          <button type="submit" class="primary">Enter</button>
          <p class="auth-note">Free tier: core numbers, daily tip, and Spirit Guide basics.</p>
          <p id="login-error" class="error"></p>
        </form>

        <form id="form-signup" class="auth-form hidden">
          <label>Username
            <input type="text" id="signup-username" autocomplete="username">
          </label>
          <label>PIN / Password
            <input type="password" id="signup-password" autocomplete="new-password">
          </label>
          <button type="submit" class="primary">Create account</button>
          <p class="auth-note">Stored on this device, synced live over Socket.IO.</p>
          <p id="signup-error" class="error"></p>
        </form>
      </div>
    </section>

    <!-- Main app layout -->
    <section id="screen-main" class="screen hidden">
      <header class="topbar">
        <div class="topbar-left">
          <h2 id="topbar-title">Dashboard</h2>
          <span id="topbar-tier-pill" class="tier-pill">Free</span>
        </div>
        <button id="btn-open-settings" class="icon-button" title="Settings">⚙</button>
      </header>

      <nav class="nav">
        <button data-route="dashboard" class="nav-btn active">Dashboard</button>
        <button data-route="profile" class="nav-btn">Profile</button>
        <button data-route="numbers" class="nav-btn">Numbers</button>
        <button data-route="readings" class="nav-btn">Readings</button>
        <button data-route="spirit" class="nav-btn">Spirit Guide</button>
        <button data-route="learn" class="nav-btn">Learn</button>
      </nav>

      <main class="content">
        <!-- Dashboard -->
        <section id="view-dashboard" class="view active">
          <h3>Welcome back</h3>

          <div id="dashboard-profile" class="card profile-card"></div>

          <div id="dashboard-life-path" class="card"></div>
          <div id="dashboard-daily-tip" class="card"></div>

          <div class="card">
            <h4>Quick actions</h4>
            <div class="quick-actions">
              <button id="btn-dash-complete-profile" class="secondary">Complete profile</button>
              <button id="btn-dash-see-numbers" class="secondary">See my numbers</button>
              <button id="btn-dash-open-spirit" class="primary">Ask the Spirit Guide</button>
            </div>
          </div>
        </section>

        <!-- Profile -->
        <section id="view-profile" class="view">
          <h3>My profile</h3>
          <div class="card">
            <h4>Identity</h4>
            <label>Full birth name (as on birth record)
              <input type="text" id="profile-full-name" placeholder="First Middle Last">
            </label>
            <label>Name you go by now
              <input type="text" id="profile-preferred-name" placeholder="Preferred name or nickname">
            </label>
            <label>Birthdate
              <input type="date" id="profile-birthdate">
            </label>
          </div>

          <div class="card">
            <h4>Context</h4>
            <label>What feels like your biggest challenge right now?
              <textarea id="profile-challenge" rows="3"></textarea>
            </label>
            <label>What are you moving toward or building?
              <textarea id="profile-goal" rows="3"></textarea>
            </label>
          </div>

          <div class="card">
            <h4>Avatar</h4>
            <div class="avatar-row">
              <div class="avatar-preview" id="profile-avatar-preview">⟳</div>
              <div class="avatar-controls">
                <label class="file-label">
                  Upload avatar
                  <input type="file" id="profile-avatar" accept="image/*">
                </label>
              </div>
            </div>
          </div>

          <div class="card">
            <button id="btn-save-profile-view" class="primary">Save profile & recalc numbers</button>
          </div>
        </section>

        <!-- Numbers -->
        <section id="view-numbers" class="view">
          <h3>My numbers</h3>

          <div class="card">
            <h4>Core path</h4>
            <div id="numbers-core-path"></div>
          </div>

          <div class="card">
            <h4>Name-based numbers</h4>
            <div id="numbers-name-based"></div>
          </div>

          <div class="card">
            <h4>Life phases & lessons</h4>
            <div id="numbers-phases"></div>
          </div>

          <div class="card">
            <h4>Number you keep seeing</h4>
            <label>Enter a number
              <input type="text" id="input-seen-number" placeholder="111, 222, 1234, etc.">
            </label>
            <button id="btn-interpret-number" class="primary small-btn">Interpret</button>
            <div id="seen-number-result" class="tip"></div>
          </div>
        </section>

        <!-- Readings -->
        <section id="view-readings" class="view">
          <h3>Readings</h3>

          <div class="card">
            <h4>Free reading: life path focus</h4>
            <div id="reading-life-path"></div>
          </div>

          <div class="card locked" id="card-advanced-readings">
            <div class="lock-overlay">
              <p>Advanced readings unlock destiny, soul, personality, karmic lessons, and more context.</p>
              <button id="btn-upgrade-readings" class="primary small-btn">Unlock Pro readings</button>
            </div>
            <div id="reading-advanced" class="hidden"></div>
          </div>
        </section>

        <!-- Spirit Guide -->
        <section id="view-spirit" class="view">
          <h3>Spirit Guide</h3>
          <div class="card">
            <p>Your Spirit Guide explains your map, shows you where to tap next, and translates everything into plain language.</p>
            <label>What do you want support with right now?
              <select id="spirit-focus">
                <option value="tour">Show me how to use this app</option>
                <option value="numbers">Explain my numbers</option>
                <option value="decision">Help me with a decision</option>
                <option value="stuck">I feel stuck or blocked</option>
                <option value="path">What is my bigger path?</option>
              </select>
            </label>
            <label>Optional: ask Spirit a specific question
              <input type="text" id="spirit-question" placeholder="Type a question for Spirit">
            </label>
            <button id="btn-spirit-generate" class="primary small-btn">Ask the Spirit Guide</button>
            <button id="btn-spirit-speak" class="secondary small-btn">Let Spirit speak out loud</button>
          </div>

          <div id="spirit-output" class="card"></div>
        </section>

        <!-- Learn -->
        <section id="view-learn" class="view">
          <h3>Learn the numbers</h3>
          <div class="card">
            <h4>Core map</h4>
            <ul class="learn-list">
              <li><strong>Life Path:</strong> your main road, from birthdate.</li>
              <li><strong>Destiny (Expression):</strong> what you are wired to build, from full name.</li>
              <li><strong>Soul Urge:</strong> what your heart quietly craves, from vowels in your name.</li>
              <li><strong>Personality:</strong> how others first read you, from consonants.</li>
              <li><strong>Birthday number:</strong> the flavor added by the day of the month you were born.</li>
              <li><strong>Maturity:</strong> what you grow into later in life (life path + destiny).</li>
              <li><strong>Karmic lessons:</strong> numbers missing from your name, showing themes you keep practicing.</li>
              <li><strong>Balance:</strong> how you tend to respond emotionally when conflict hits.</li>
            </ul>
          </div>

          <div class="card">
            <h4>How to get the best reading here</h4>
            <ol class="learn-list">
              <li>Fill out your Profile with full birth name and accurate birthdate.</li>
              <li>Save it so the app can calculate all your core numbers.</li>
              <li>Visit “Numbers” to see the full map.</li>
              <li>Open “Readings” and unlock Pro if you want deeper interpretation.</li>
              <li>Talk to the Spirit Guide when you feel confused or stuck.</li>
            </ol>
          </div>
        </section>
      </main>
    </section>

    <!-- Settings modal -->
    <div id="modal-settings" class="modal hidden">
      <div class="modal-content">
        <header class="modal-header">
          <h3>Settings & access</h3>
          <button id="btn-close-settings" class="icon-button">✕</button>
        </header>
        <div class="modal-body">
          <section class="card">
            <h4>Theme</h4>
            <label>
              Theme
              <select id="settings-theme">
                <option value="midnight">Midnight (black, purple, midnight blue)</option>
                <option value="light">Starlight (white, soft purple)</option>
              </select>
            </label>
          </section>

          <section class="card">
            <h4>Access and tiers</h4>
            <p id="tier-status"></p>
            <button id="btn-open-paypal-pro" class="secondary small-btn">Upgrade to Pro (PayPal)</button>
          </section>

          <section class="card danger">
            <h4>Data</h4>
            <button id="btn-export-data" class="secondary small-btn">Export data (JSON)</button>
            <button id="btn-reset-all" class="secondary small-btn">Reset all data on this device</button>
            <button id="btn-logout" class="secondary small-btn">Log out</button>
          </section>
        </div>
      </div>
    </div>

    <div id="toast" class="toast hidden"></div>
  </div>

  <script src="app.js"></script>
</body>
</html>
