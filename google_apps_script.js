// ============================================
// QA PERFORMANCE MONITORING SYSTEM
// Google Apps Script для интеграции с Google Sheets
// ============================================

// ВАЖНО: Этот код нужно разместить в Google Apps Script
// связанном с вашей Google Таблицей для хранения данных

// ============= CONFIGURATION =============
const SHEET_NAMES = {
  USERS: 'Users',
  DISPATCHERS: 'Dispatchers',
  EVALUATIONS: 'Evaluations',
  ACTIVITY_LOG: 'ActivityLog'
};

const WORKLOAD_SHEET_ID = '1oglMgU_LOX29mc0SfNGLwvIGjwInOASup4XE-4BIgLk'; // ID вашей таблицы Work load

// ============= MAIN ENDPOINTS =============

/**
 * Главная функция для обработки POST запросов из HTML
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    switch(action) {
      case 'login':
        return handleLogin(params);
      case 'getDispatchers':
        return getDispatchers(params);
      case 'addDispatcher':
        return addDispatcher(params);
      case 'importFromWorkload':
        return importFromWorkload(params);
      case 'saveEvaluation':
        return saveEvaluation(params);
      case 'getEvaluations':
        return getEvaluations(params);
      case 'getUsers':
        return getUsers(params);
      case 'addUser':
        return addUser(params);
      case 'resetPassword':
        return resetPassword(params);
      case 'deleteUser':
        return deleteUser(params);
      case 'getActivityLogs':
        return getActivityLogs(params);
      case 'logActivity':
        return logActivity(params);
      default:
        return createResponse(false, 'Unknown action');
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(false, error.toString());
  }
}

/**
 * Главная функция для обработки GET запросов
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'QA Performance Monitoring API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============= AUTHENTICATION =============

/**
 * Обработка входа пользователя
 */
function handleLogin(params) {
  const email = params.email;
  const password = params.password;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  const data = usersSheet.getDataRange().getValues();
  
  // Пропускаем заголовок
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0] === email && row[3] === password) {
      // Логируем вход
      logActivity({
        user: email,
        action: 'LOGIN_SUCCESS',
        details: 'Успешный вход в систему'
      });
      
      return createResponse(true, 'Login successful', {
        email: row[0],
        name: row[1],
        role: row[2]
      });
    }
  }
  
  // Неудачная попытка входа
  logActivity({
    user: email,
    action: 'LOGIN_FAILED',
    details: 'Неверный пароль'
  });
  
  return createResponse(false, 'Invalid credentials');
}

// ============= DISPATCHER MANAGEMENT =============

/**
 * Получить список диспетчеров пользователя
 */
function getDispatchers(params) {
  const userEmail = params.userEmail;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dispatchersSheet = getOrCreateSheet(ss, SHEET_NAMES.DISPATCHERS);
  const data = dispatchersSheet.getDataRange().getValues();
  
  const dispatchers = [];
  
  // Пропускаем заголовок
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[5] === userEmail) { // Колонка AddedBy
      dispatchers.push({
        id: row[0],
        name: row[1],
        position: row[2],
        email: row[3],
        agent: row[4],
        addedBy: row[5],
        dateAdded: row[6]
      });
    }
  }
  
  return createResponse(true, 'Dispatchers retrieved', dispatchers);
}

/**
 * Добавить нового диспетчера
 */
function addDispatcher(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dispatchersSheet = getOrCreateSheet(ss, SHEET_NAMES.DISPATCHERS);
  
  const id = new Date().getTime();
  const dateAdded = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy');
  
  dispatchersSheet.appendRow([
    id,
    params.name,
    params.position,
    params.email,
    params.agent || '',
    params.addedBy,
    dateAdded
  ]);
  
  logActivity({
    user: params.addedBy,
    action: 'ADD_DISPATCHER',
    details: 'Добавлен диспетчер: ' + params.name
  });
  
  return createResponse(true, 'Dispatcher added', { id: id });
}

/**
 * Импорт диспетчеров из таблицы Work load
 */
function importFromWorkload(params) {
  const userEmail = params.userEmail;
  
  try {
    // Определяем вкладку пользователя по email
    const userSheetName = getUserSheetName(userEmail);
    
    if (!userSheetName) {
      return createResponse(false, 'Не найдена вкладка для вашего email в Work load');
    }
    
    // Открываем таблицу Work load
    const workloadSpreadsheet = SpreadsheetApp.openById(WORKLOAD_SHEET_ID);
    const userSheet = workloadSpreadsheet.getSheetByName(userSheetName);
    
    if (!userSheet) {
      return createResponse(false, 'Не найдена вкладка: ' + userSheetName);
    }
    
    // Читаем данные
    const data = userSheet.getDataRange().getValues();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dispatchersSheet = getOrCreateSheet(ss, SHEET_NAMES.DISPATCHERS);
    
    let importedCount = 0;
    
    // Пропускаем заголовок (строка 1)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Проверяем, есть ли имя
      if (!row[0]) continue; // Колонка A: Personal ID / First Name + Last Name
      
      const name = row[0]; // Personal ID / First Name + Last Name
      const agentName = row[1]; // Agent
      const email = row[2]; // Email
      const position = row[3]; // Position
      
      // Проверяем, не добавлен ли уже этот диспетчер
      const existingData = dispatchersSheet.getDataRange().getValues();
      let exists = false;
      
      for (let j = 1; j < existingData.length; j++) {
        if (existingData[j][1] === name && existingData[j][5] === userEmail) {
          exists = true;
          break;
        }
      }
      
      if (!exists) {
        const id = new Date().getTime() + i;
        const dateAdded = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy');
        
        dispatchersSheet.appendRow([
          id,
          name,
          position || 'Not specified',
          email || '',
          agentName || '',
          userEmail,
          dateAdded
        ]);
        
        importedCount++;
      }
    }
    
    logActivity({
      user: userEmail,
      action: 'IMPORT_FROM_WORKLOAD',
      details: 'Imported agents (all positions): ' + importedCount
    });
    
    return createResponse(true, 'Imported: ' + importedCount + ' agents', { count: importedCount });
    
  } catch (error) {
    Logger.log('Error in importFromWorkload: ' + error.toString());
    return createResponse(false, 'Ошибка импорта: ' + error.toString());
  }
}

/**
 * Определить название вкладки пользователя в Work load по email
 */
function getUserSheetName(email) {
  const userEmailMap = {
    'i.buneev@qlab-university.com': 'Ivan B.',
    'alina@rpmdispatch.com': 'Alina H.',
    'anatoliy@carolinalogisticsinc.com': 'Anatoliy',
    'y.semenov@qlab-university.com': 'Yevhenii',
    'kate.ef@rpmdispatch.com': 'Kate',
    'a.shportko@qlab-university.com': 'Alina S.',
    'v.muzykant@qlab-university.com': 'Valentyna',
    'a.lukianenko@qlab-university.com': 'Ann'
  };
  
  return userEmailMap[email] || null;
}

// ============= EVALUATION MANAGEMENT =============

/**
 * Сохранить оценку
 */
function saveEvaluation(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const evaluationsSheet = getOrCreateSheet(ss, SHEET_NAMES.EVALUATIONS);
  
  const id = new Date().getTime();
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm:ss');
  
  evaluationsSheet.appendRow([
    id,
    params.dispatcherId,
    params.dispatcherName,
    params.evaluatedBy,
    date,
    params.totalScore,
    JSON.stringify(params.criteria),
    JSON.stringify(params.checklist)
  ]);
  
  logActivity({
    user: params.evaluatedBy,
    action: 'CREATE_EVALUATION',
    details: 'Создана оценка для ' + params.dispatcherName + ': ' + params.totalScore.toFixed(1) + '%'
  });
  
  return createResponse(true, 'Evaluation saved', { id: id });
}

/**
 * Получить историю оценок пользователя
 */
function getEvaluations(params) {
  const userEmail = params.userEmail;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const evaluationsSheet = getOrCreateSheet(ss, SHEET_NAMES.EVALUATIONS);
  const data = evaluationsSheet.getDataRange().getValues();
  
  const evaluations = [];
  
  // Пропускаем заголовок
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[3] === userEmail) { // Колонка EvaluatedBy
      evaluations.push({
        id: row[0],
        dispatcherId: row[1],
        dispatcherName: row[2],
        evaluatedBy: row[3],
        date: row[4],
        totalScore: row[5],
        criteria: JSON.parse(row[6]),
        checklist: JSON.parse(row[7])
      });
    }
  }
  
  return createResponse(true, 'Evaluations retrieved', evaluations);
}

// ============= USER MANAGEMENT (Admin only) =============

/**
 * Получить список всех пользователей
 */
function getUsers(params) {
  // Проверка прав администратора
  if (!isAdmin(params.requestedBy)) {
    return createResponse(false, 'Access denied');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  const data = usersSheet.getDataRange().getValues();
  
  const users = [];
  
  // Пропускаем заголовок
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    users.push({
      email: row[0],
      name: row[1],
      role: row[2],
      password: row[3] // В production использовать хеширование!
    });
  }
  
  return createResponse(true, 'Users retrieved', users);
}

/**
 * Добавить нового пользователя
 */
function addUser(params) {
  // Проверка прав администратора
  if (!isAdmin(params.requestedBy)) {
    return createResponse(false, 'Access denied');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  
  // Проверка на существование пользователя
  const data = usersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === params.email) {
      return createResponse(false, 'User already exists');
    }
  }
  
  usersSheet.appendRow([
    params.email,
    params.name,
    params.role,
    params.password // В production использовать хеширование!
  ]);
  
  logActivity({
    user: params.requestedBy,
    action: 'ADD_USER',
    details: 'Добавлен пользователь: ' + params.name + ' (' + params.email + ')'
  });
  
  return createResponse(true, 'User added');
}

/**
 * Сбросить пароль пользователя
 */
function resetPassword(params) {
  // Проверка прав администратора
  if (!isAdmin(params.requestedBy)) {
    return createResponse(false, 'Access denied');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  const data = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === params.email) {
      // Обновляем пароль
      usersSheet.getRange(i + 1, 4).setValue(params.newPassword);
      
      logActivity({
        user: params.requestedBy,
        action: 'RESET_PASSWORD',
        details: 'Сброшен пароль для: ' + params.email
      });
      
      return createResponse(true, 'Password reset');
    }
  }
  
  return createResponse(false, 'User not found');
}

/**
 * Удалить пользователя
 */
function deleteUser(params) {
  // Проверка прав администратора
  if (!isAdmin(params.requestedBy)) {
    return createResponse(false, 'Access denied');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  const data = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === params.email) {
      usersSheet.deleteRow(i + 1);
      
      logActivity({
        user: params.requestedBy,
        action: 'DELETE_USER',
        details: 'Удален пользователь: ' + data[i][1] + ' (' + params.email + ')'
      });
      
      return createResponse(true, 'User deleted');
    }
  }
  
  return createResponse(false, 'User not found');
}

/**
 * Проверка прав администратора
 */
function isAdmin(email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  const data = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email && data[i][2] === 'admin') {
      return true;
    }
  }
  
  return false;
}

// ============= ACTIVITY LOGGING =============

/**
 * Логировать действие пользователя
 */
function logActivity(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = getOrCreateSheet(ss, SHEET_NAMES.ACTIVITY_LOG);
  
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm:ss');
  
  logSheet.appendRow([
    timestamp,
    params.user,
    params.action,
    params.details
  ]);
  
  return createResponse(true, 'Activity logged');
}

/**
 * Получить логи активности
 */
function getActivityLogs(params) {
  // Проверка прав администратора
  if (!isAdmin(params.requestedBy)) {
    return createResponse(false, 'Access denied');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = getOrCreateSheet(ss, SHEET_NAMES.ACTIVITY_LOG);
  const data = logSheet.getDataRange().getValues();
  
  const logs = [];
  
  // Пропускаем заголовок
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    logs.push({
      timestamp: row[0],
      user: row[1],
      action: row[2],
      details: row[3]
    });
  }
  
  return createResponse(true, 'Logs retrieved', logs);
}

// ============= UTILITY FUNCTIONS =============

/**
 * Создать ответ в формате JSON
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Получить или создать лист в таблице
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    
    // Добавляем заголовки в зависимости от типа листа
    switch(sheetName) {
      case SHEET_NAMES.USERS:
        sheet.appendRow(['Email', 'Name', 'Role', 'Password']);
        // Добавляем администратора по умолчанию
        sheet.appendRow(['alina@rpmdispatch.com', 'Alina H.', 'admin', 'admin123']);
        break;
        
      case SHEET_NAMES.DISPATCHERS:
        sheet.appendRow(['ID', 'Name', 'Position', 'Email', 'Agent', 'AddedBy', 'DateAdded']);
        break;
        
      case SHEET_NAMES.EVALUATIONS:
        sheet.appendRow(['ID', 'DispatcherID', 'DispatcherName', 'EvaluatedBy', 'Date', 'TotalScore', 'CriteriaJSON', 'ChecklistJSON']);
        break;
        
      case SHEET_NAMES.ACTIVITY_LOG:
        sheet.appendRow(['Timestamp', 'User', 'Action', 'Details']);
        break;
    }
    
    // Форматирование заголовков
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#8B1538');
    headerRange.setFontColor('#FFFFFF');
  }
  
  return sheet;
}

/**
 * Инициализация таблицы (вызывается один раз при первой настройке)
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  getOrCreateSheet(ss, SHEET_NAMES.USERS);
  getOrCreateSheet(ss, SHEET_NAMES.DISPATCHERS);
  getOrCreateSheet(ss, SHEET_NAMES.EVALUATIONS);
  getOrCreateSheet(ss, SHEET_NAMES.ACTIVITY_LOG);
  
  Logger.log('Sheets initialized successfully');
}
