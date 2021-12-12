export const getCsrfToken = () => {
      const csrf = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
      return csrf ? csrf.pop() : '';
    };

export const headers = {
    "X-CSRFToken" : getCsrfToken()
};