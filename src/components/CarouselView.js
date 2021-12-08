import React, { Component } from 'react';
import { View, ScrollView, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';

import CarouselIndicator from '@src/components/CarouselIndicator';

const propTypes = {
  children: PropTypes.node.isRequired,
  showIndicator: PropTypes.bool,
  style: PropTypes.object.isRequired,
};

class CarouselView extends Component {
  offset;
  nextPage;
  scrollView;
  timer;

  static defaultProps = {
    // data
    // childrenWidth
    // childrenHeight
    showIndicator: false,
    delay: 4000,
    autoplay: true,
    currentPage: 0,
    style: undefined,
    onAnimateNextPage: undefined,
    onPageBeingChanged: undefined,
    swipe: true,
    isLooped: true,
  };

  constructor(props) {
    super(props);
    const size = { width: 0, height: 0 };

    // let kontenDiDalem = props.data.map((e, idx) => {
    //     return (
    //         <View key={idx} style={{width: props.childrenWidth, height: props.childrenHeight}}>
    //             <Image source={{uri: e.image}} style={{height: '100%', width: '100%', resizeMode: 'cover', borderRadius: 8}} />
    //         </View>
    //     )
    // });

    if (props.children) {
      const childrenLength = React.Children.count(props.children) || 1;
      this.state = {
        currentPage: props.currentPage,
        size,
        childrenLength,
        contents: null,
        // kontenDiDalem,
      };
    } else {
      this.state = {
        size,
        // kontenDiDalem
      };
    }
    this.offset = 0;
    this.nextPage = 0;
  }

  componentDidMount() {
    if (this.state.childrenLength) {
      this._setUpTimer();
    }
  }

  componentWillUnmount() {
    this._clearTimer && this._clearTimer();
  }

  componentDidUpdate({ children }) {
    // !isEqual
    if (this.props.children !== children) {
      const { currentPage } = this.state;
      this._clearTimer && this._clearTimer();
      let childrenLength = 0;
      if (children) {
        childrenLength = React.Children.count(children) || 1;
      }
      const nextPage = currentPage >= childrenLength ? childrenLength - 1 : currentPage;
      this.setState({ childrenLength }, () => {
        this.animateToPage(nextPage);
        this._setUpTimer();
      });
    }
  }

  _setUpPages() {
    const { size } = this.state;
    const { children: propsChildren, isLooped, style } = this.props;
    const children = React.Children.toArray(propsChildren);
    
    // const children = this.state.kontenDiDalem;

    const pages = [];

    if (children && children.length > 1) {
      // add all pages
      pages.push(...children);
      // We want to make infinite pages structure like this: 1-2-3-1-2
      // so we add first and second page again to the end
      if (isLooped) {
        pages.push(children[0]);
        pages.push(children[1]);
      }
    } else if (children) {
      pages.push(children[0]);
    } else {
      pages.push(
        <View />
      );
    }

    return pages.map((page, i) => (
      <View style={[{ ...size }, style, { alignItems: 'center' }]} key={`page${i}`}>
        {page}
      </View>
    ));
  }

  getCurrentPage() {
    return this.state.currentPage;
  }

  _setCurrentPage = (currentPage) => {
    this.setState({ currentPage }, () => {
      if (this.props.onAnimateNextPage) {
        // FIXME: called twice on ios with auto-scroll
        this.props.onAnimateNextPage(currentPage);
      }
    });
  };

  _onScrollBegin = () => {
    this._clearTimer && this._clearTimer();
  };

  _onScrollEnd = (event) => {
    const offset = { ...event.nativeEvent.contentOffset };
    const page = this._calculateCurrentPage(offset.x);
    this._placeCritical(page);
    this._setCurrentPage(page);
    this._setUpTimer();
  };

  _onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.x;
    const direction = currentOffset > this.offset ? 'right' : 'left';
    this.offset = currentOffset;
    const nextPage = this._calculateNextPage(direction);
    if (this.nextPage !== nextPage) {
      this.nextPage = nextPage;
      if (this.props.onPageBeingChanged) {
        this.props.onPageBeingChanged(this.nextPage);
      }
    }
  };

  _onLayout = (event) => {
    const { height, width } = event.nativeEvent.layout;
    this.setState({ size: { width, height } });
    // remove setTimeout wrapper when https://github.com/facebook/react-native/issues/6849 is resolved.
    this._placeCritical(this.state.currentPage);
    // setTimeout(() => this._placeCritical(this.state.currentPage as number), 0);
  };

  _clearTimer = () => {
    this.timer && clearTimeout(this.timer);
  };

  _setUpTimer = () => {
    // only for cycling
    if (this.props.autoplay && React.Children.count(this.props.children) > 1) {
      this._clearTimer();
      this.timer = setTimeout(this._animateNextPage, this.props.delay);
    }
  };

  _scrollTo = ({ offset, animated, nofix }) => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ y: 0, x: offset, animated });

      // Fix bug #50
      if (!nofix && Platform.OS === 'android' && !animated) {
        this.scrollView.scrollTo({ y: 0, x: offset, animated: true });
      }
    }
  };

  _animateNextPage = () => {
    const { currentPage } = this.state;
    const nextPage = this._normalizePageNumber(currentPage + 1);

    // prevent from looping
    if (!this.props.isLooped && nextPage < currentPage) {
      return;
    }
    this.animateToPage(nextPage);
  };

  _animatePreviousPage = () => {
    const { currentPage } = this.state;
    const nextPage = this._normalizePageNumber(currentPage - 1);

    // prevent from looping
    if (!this.props.isLooped && nextPage > currentPage) {
      return;
    }
    this.animateToPage(nextPage);
  };

  animateToPage = (page) => {
    const {
      currentPage,
      childrenLength,
      size: { width },
    } = this.state;
    const { isLooped } = this.props;
    const nextPage = this._normalizePageNumber(page);
    this._clearTimer();
    if (nextPage === currentPage) {
      // pass
    } else if (nextPage === 0) {
      if (isLooped) {
        // animate properly based on direction
        if (currentPage !== childrenLength - 1) {
          this._scrollTo({
            offset: (childrenLength + 2) * width,
            animated: false,
            nofix: true,
          });
        }
        this._scrollTo({ offset: childrenLength * width, animated: true });
      } else {
        this._scrollTo({ offset: 0, animated: true });
      }
    } else if (nextPage === 1) {
      // To properly animate from the first page we need to move view
      // to its original position first (not needed if not looped)
      if (currentPage === 0 && isLooped) {
        this._scrollTo({ offset: 0, animated: false, nofix: true });
      }
      this._scrollTo({ offset: width, animated: true });
    } else {
      // Last page is allowed to jump to the first through the "border"
      if (currentPage === 0 && nextPage !== childrenLength - 1) {
        this._scrollTo({ offset: 0, animated: false, nofix: true });
      }
      this._scrollTo({ offset: nextPage * width, animated: true });
    }
    this._setCurrentPage(nextPage);
    this._setUpTimer();
  };

  _placeCritical = (page) => {
    const { isLooped } = this.props;
    const {
      childrenLength,
      size: { width },
    } = this.state;
    let offset = 0;
    // if page number is bigger then length - something is incorrect
    if (page < childrenLength) {
      if (page === 0 && isLooped) {
        // in "looped" scenario first page shold be placed after the last one
        offset = childrenLength * width;
      } else {
        offset = page * width;
      }
    }

    this._scrollTo({ offset, animated: false });
  };

  _normalizePageNumber = (page) => {
    const { childrenLength } = this.state;

    if (page === childrenLength) {
      return 0;
    } else if (page > childrenLength) {
      return 1;
    } else if (page < 0) {
      return childrenLength - 1;
    }
    return page;
  };

  _calculateCurrentPage = (offset) => {
    const { width } = this.state.size;
    const page = Math.round(offset / width);
    return this._normalizePageNumber(page);
  };

  _calculateNextPage = (direction) => {
    const { width } = this.state.size;
    const ratio = this.offset / width;
    const page = direction === 'right' ? Math.ceil(ratio) : Math.floor(ratio);
    return this._normalizePageNumber(page);
  };

  render() {
    const contents = this._setUpPages();

    const { size, childrenLength } = this.state;

    return (
        <>
            <View onLayout={this._onLayout} style={[this.props.style]}>
                <ScrollView
                    ref={(c) => this.scrollView = c}
                    onScrollBeginDrag={this._onScrollBegin}
                    onMomentumScrollEnd={this._onScrollEnd}
                    onScroll={this._onScroll}
                    alwaysBounceHorizontal={false}
                    alwaysBounceVertical={false}
                    contentInset={{ top: 0 }}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    pagingEnabled
                    bounces={false}
                    scrollEnabled={this.props.swipe}
                    scrollEventThrottle={16}
                    contentContainerStyle={[
                        {
                            position: 'absolute',
                            width: size.width * (childrenLength + (childrenLength > 1 && this.props.isLooped ? 2 : 0)),
                            height: size.height,
                        },
                    ]}
                >
                    {contents}
                </ScrollView>
            </View>

            {this.props.showIndicator && <CarouselIndicator
                count={childrenLength}
                currentIndex={this.state.currentPage}
                containerStyle={{marginTop: 16}}
            />}
        </>
    );
  }
}

CarouselView.propTypes = propTypes;

export default CarouselView;