import { renderHook, act } from '@testing-library/react';
import { useNotificationSystem } from '../useNotifications';

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Note: useNotificationStore is not exported, so we test only useNotificationSystem

  describe('useNotificationSystem', () => {
    it('should return notifications and functions', () => {
      const { result } = renderHook(() => useNotificationSystem());
      
      expect(result.current.notifications).toEqual([]);
      expect(typeof result.current.removeNotification).toBe('function');
      expect(typeof result.current.showSuccess).toBe('function');
      expect(typeof result.current.showError).toBe('function');
      expect(typeof result.current.showWarning).toBe('function');
      expect(typeof result.current.showInfo).toBe('function');
    });

    it('should add success notification', () => {
      const { result } = renderHook(() => useNotificationSystem());
      
      act(() => {
        result.current.showSuccess('Success!', 'Operation completed successfully');
      });
      
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0]).toMatchObject({
        type: 'success',
        title: 'Success!',
        message: 'Operation completed successfully'
      });
    });

    it('should add error notification', () => {
      const { result } = renderHook(() => useNotificationSystem());
      
      act(() => {
        result.current.showError('Error!', 'Something went wrong');
      });
      
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0]).toMatchObject({
        type: 'error',
        title: 'Error!',
        message: 'Something went wrong'
      });
    });

    it('should add warning notification', () => {
      const { result } = renderHook(() => useNotificationSystem());
      
      act(() => {
        result.current.showWarning('Warning!', 'Please check your input');
      });
      
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0]).toMatchObject({
        type: 'warning',
        title: 'Warning!',
        message: 'Please check your input'
      });
    });

    it('should add info notification', () => {
      const { result } = renderHook(() => useNotificationSystem());
      
      act(() => {
        result.current.showInfo('Info', 'Here is some information');
      });
      
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0]).toMatchObject({
        type: 'info',
        title: 'Info',
        message: 'Here is some information'
      });
    });

    // Note: addNotification is not available in useNotificationSystem

    it('should remove notification by id', () => {
      const { result } = renderHook(() => useNotificationSystem());
      
      act(() => {
        result.current.showSuccess('Test', 'Message');
      });
      
      const notificationId = result.current.notifications[0].id;
      
      act(() => {
        result.current.removeNotification(notificationId);
      });
      
      expect(result.current.notifications).toHaveLength(0);
    });

    it('should handle multiple notifications', () => {
      const { result } = renderHook(() => useNotificationSystem());
      
      act(() => {
        result.current.showSuccess('Success 1', 'First message');
        result.current.showError('Error 1', 'First error');
        result.current.showWarning('Warning 1', 'First warning');
      });
      
      expect(result.current.notifications).toHaveLength(3);
      expect(result.current.notifications[0].type).toBe('success');
      expect(result.current.notifications[1].type).toBe('error');
      expect(result.current.notifications[2].type).toBe('warning');
    });

    it('should generate unique IDs for notifications', () => {
      const { result } = renderHook(() => useNotificationSystem());
      
      act(() => {
        result.current.showSuccess('Test 1', 'Message 1');
        result.current.showSuccess('Test 2', 'Message 2');
      });
      
      expect(result.current.notifications).toHaveLength(2);
      expect(result.current.notifications[0].id).not.toBe(result.current.notifications[1].id);
    });
  });
});
